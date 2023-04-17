from flask import (
    Blueprint,
    render_template,
    request,
    current_app,
    jsonify
)
from .prompts import EXPLAIN
import openai
import json
from flask_cors import cross_origin
from .test_files import FILES


bp = Blueprint('files', __name__)


def get_test_file(id):
    return FILES[id]

def get_test_file_manifest():
    return [{'title': x['title'], 'language': x['language'], 'id': x['id']} for x in FILES]


@bp.route('/files', methods=('GET',))
@cross_origin()
def files():
    test = request.args.get('test')
    id = int(request.args.get('id'))

    file = get_test_file(id)
    text = file['text']
    language = file['language']

    return jsonify({"status": "success", "file_content": text, "language": language})

@bp.route('/manifest', methods=('GET',))
@cross_origin()
def manifest():
   return jsonify({"status": "success", "articles": get_test_file_manifest()})
