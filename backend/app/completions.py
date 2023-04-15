from flask import (
    Blueprint,
    render_template,
    request,
    current_app
)
from .prompts import EXPLAIN
import openai
import json
from flask_cors import cross_origin


bp = Blueprint('completions', __name__)

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

    openai.api_key = current_app.config['OPENAI_API_KEY']
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    choice = response['choices'][0]['message']['content']

    return json.dumps({
        'status': 'success',
        'text': choice
    })
