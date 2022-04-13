from flask import (Blueprint, flash, g, redirect, render_template, request, url_for)
from .db import Database
import operator

bp = Blueprint('home', __name__)


@bp.route('/', methods=["GET"])
def index():
    db = Database()
    data = db.get_data()
    sort_data_by_ddl = dict(sorted(data.items(), key=lambda k: k[1]['deadline'], reverse=True))

    return render_template('home.html',
                           data=sort_data_by_ddl)


@bp.route('/save', methods=["POST"])
def save():
    request.get_data()
    json_data = request.json

    db = Database()
    db.insert(json_data['item_name'], json_data['item_deadline'])

    data = db.get_data()
    sort_data_by_ddl = dict(sorted(data.items(), key=lambda k: k[1]['deadline'], reverse=True))

    return_dict = {}
    index_dict = 0

    for key, value in sort_data_by_ddl.items():
        return_dict[index_dict] = value
        index_dict += 1

    index_dict = 0

    return return_dict


@bp.route('/delete', methods=["POST"])
def delete():
    request.get_data()
    json_data = request.json

    db = Database()
    db.delete(int(json_data['item_id'].split("finish-", 1)[1]))

    data = db.get_data()
    sort_data_by_ddl = dict(sorted(data.items(), key=lambda k: k[1]['deadline'], reverse=True))

    return_dict = {}
    index_dict = 0

    for key, value in sort_data_by_ddl.items():
        return_dict[index_dict] = value
        index_dict += 1

    index_dict = 0

    return return_dict


@bp.route('/update', methods=["PUT"])
def update():
    request.get_data()
    json_data = request.json

    db = Database()
    db.update(int(json_data["item_id"]), json_data["item_name"], json_data["item_deadline"])

    data = db.get_data()
    sort_data_by_ddl = dict(sorted(data.items(), key=lambda k: k[1]['deadline'], reverse=True))

    return_dict = {}
    index_dict = 0

    for key, value in sort_data_by_ddl.items():
        return_dict[index_dict] = value
        index_dict += 1

    index_dict = 0

    return return_dict

