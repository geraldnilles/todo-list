
import os
from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'todos.json'),
    )

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    with app.app_context():
        from . import db

    @app.route("/hello")
    def hello():
        return "Hello World"

    from . import api
    app.register_blueprint(api.bp)

    return app




