import os

from flask import Flask
from .secret_keys import OPENAI_API_KEY
from flask_cors import CORS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        OPENAI_API_KEY=OPENAI_API_KEY
    )

    cors = CORS(app)

    from . import completions
    app.register_blueprint(completions.bp)

    @app.route('/', methods=('GET',))
    def home():
        return "A British tar is a soaring soul, as free as a mountain bird."

    return app