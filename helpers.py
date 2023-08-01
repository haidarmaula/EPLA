import sqlite3


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
    return con, cur