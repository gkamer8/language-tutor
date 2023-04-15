from flask import (
    Blueprint,
    render_template,
    request,
    current_app
)
from .prompts import EXPLAIN
import openai
import json

bp = Blueprint('completions', __name__)

@bp.route('/explain', methods=('GET',))
def explain():

    sample = request.args.get('sample')
    language = request.args.get('language')

    kwargs = {
        'language': language,
        'text': sample
    }
    prompt = EXPLAIN.format(**kwargs)

    print(prompt)

    openai.api_key = current_app.config['OPENAI_API_KEY']
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    choice = response['choices'][0]['message']

    return json.dumps({
        'status': 'success',
        'text': choice
    })
