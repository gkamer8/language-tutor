from flask import (
    Blueprint,
    render_template,
    request,
    current_app
)
from .prompts import COMPREHENSION, EXPLAIN, TOTENSE, TRANSLATE, VOCAB
import openai
import json
from flask_cors import cross_origin
from .long_range import break_up_passage
import random


bp = Blueprint('completions', __name__)



# Wrapper around gpt-3.5-tubo
# No batched completions atm
# prompt can be a list or just the prompt
# tradeoff = "fast" | "best"
def get_completion(prompt, tradeoff='fast'):

    assert(tradeoff == 'fast' or tradeoff == 'best')

    # prompt can be iterable or not iterable
    prompts = []
    batched = False
    if isinstance(prompt, list):
        prompts += prompt
        batched = True
    else:
        prompts = [prompt]

    results = []
    # No batched completions yet - just do one at a time
    # No distinction in tradeoff yet (should also account for testing)
    for txt in prompts:
        openai.api_key = current_app.config['OPENAI_API_KEY']
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": txt}
            ]
        )
        results.append(response['choices'][0]['message']['content'])
    
    if batched:
        return results
    else:
        return results[0]


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

    choice = get_completion(prompt, tradeoff='best')

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

    choice = get_completion(prompt, tradeoff='fast')

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

    selected_prompts = [prompts[i] for i in selected_passages]

    choices = get_completion(selected_prompts, "fast")

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
    selected_prompts = [prompts[i] for i in selected_passages]

    choices = get_completion(selected_prompts, tradeoff="fast")
    all_vocab_words = []

    for words in choices:
        try:
            vocab_words = words.split(",")
            all_vocab_words.extend(vocab_words)
        except:
            return json.dumps({
                'status': 'failure',
                'reason': 'AI model error'
            })

    all_vocab_words = list(set(all_vocab_words))  # avoid duplicates
    return json.dumps({
        'status': 'success',
        'vocab': all_vocab_words
    })


@bp.route('/convert-tense', methods=('GET',))
@cross_origin()
def convert_tense():
    sample = request.args.get('sample')
    language = request.args.get('language')
    to_tense = request.args.get('to_tense')


    kwargs = {
        'language': language,
        'to_tense': to_tense,
        'text': sample
    }
    prompt = TOTENSE.format(**kwargs)

    choice = get_completion(prompt, tradeoff='fast')

    return json.dumps({
        'status': 'success',
        'text': choice
    })
