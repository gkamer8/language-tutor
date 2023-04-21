from flask import (
    Blueprint,
    render_template,
    request,
    current_app
)
from .prompts import COMPREHENSION, EXPLAIN, TRANSLATE, VOCAB
import openai
import json
from flask_cors import cross_origin
from .long_range import break_up_passage
import random


bp = Blueprint('completions', __name__)



# Wrapper around gpt-3.5-tubo
# No batched completions atm
def get_completion(prompt):
    openai.api_key = current_app.config['OPENAI_API_KEY']
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response['choices'][0]['message']['content']


@bp.route('/explain', methods=('GET',))
@cross_origin()
def explain():

    sample = request.args.get('sample')
    language = request.args.get('language')

    kwargs = {
        'language': language,
        'text': sample
    }
    prompt = EXPLAIN.format(**kwargs)

    choice = get_completion(prompt)

    return json.dumps({
        'status': 'success',
        'text': choice
    })


@bp.route('/translate', methods=('GET',))
@cross_origin()
def translate():

    sample = request.args.get('sample')
    language = request.args.get('language')

    kwargs = {
        'language': language,
        'text': sample
    }
    prompt = TRANSLATE.format(**kwargs)

    choice = get_completion(prompt)

    return json.dumps({
        'status': 'success',
        'text': choice
    })


@bp.route('/comprehension', methods=('GET',))
@cross_origin()
def comprehension():
    sample = request.args.get('sample')
    language = request.args.get('language')

    passages = break_up_passage(sample, max_char_size=6*750)

    kwargs = [{
        'language': language,
        'text': x
    } for x in passages]
    prompts = [COMPREHENSION.format(**x) for x in kwargs]

    MAX_QUESTIONS = min([3, len(prompts)])
    selected_passages = random.sample(range(len(prompts)), MAX_QUESTIONS)

    choices = []

    for i in selected_passages:
        choices.append(get_completion(prompts[i]))

    return json.dumps({
        'status': 'success',
        'questions': choices
    })


@bp.route('/vocab', methods=('GET',))
@cross_origin()
def vocab():
    sample = request.args.get('sample')
    language = request.args.get('language')

    passages = break_up_passage(sample, max_char_size=6*750)

    kwargs = [{
        'language': language,
        'text': x,
        'nwords': 3
    } for x in passages]
    prompts = [VOCAB.format(**x) for x in kwargs]

    MAX_QUESTIONS = min([3, len(prompts)])
    selected_passages = random.sample(range(len(prompts)), MAX_QUESTIONS)

    choices = []

    for i in selected_passages:
        words = get_completion(prompts[i])
        try:
            vocab_words = words.split(",")
            choices.extend(vocab_words)
        except:
            return json.dumps({
                'status': 'failure',
                'reason': 'AI model error'
            })

    vocab_words = list(set(vocab_words))  # avoid duplicates

    return json.dumps({
        'status': 'success',
        'vocab': choices
    })
