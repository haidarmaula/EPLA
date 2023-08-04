import sqlite3
from flask import session, redirect
from functools import wraps


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


# Determines whether a dict is a sub-dict of another dict
def is_sub_dict(sub_dict, main_dict):
    for key, value in sub_dict.items():
        if main_dict[key] != value:
            return False
    return True


# Connect database
def database(db="database.db"):
    con = sqlite3.connect(db)
    cur = con.cursor()
    cur.execute("PRAGMA foreign_keys = 1")
    return con, cur