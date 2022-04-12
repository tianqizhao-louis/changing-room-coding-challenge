import os

from flask import Flask
import sqlite3


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    conn = sqlite3.connect('todolist.db')

    c = conn.cursor()

    with open(os.path.join(os.getcwd(), 'db_gen.sql'), 'r') as sql_file:
        c.executescript(sql_file.read())
    conn.close()

    from . import home

    app.register_blueprint(home.bp)

    app.add_url_rule('/', endpoint='index')

    return app
