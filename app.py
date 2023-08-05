import os
import requests
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import login_required, is_sub_dict, database

# Create Flask application
app = Flask(__name__)

# Configure session
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
Session(app)

# Make sure API key is set
API_KEY = os.environ.get("API_KEY")

if not API_KEY:
    raise RuntimeError("API_KEY not set")


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username or not password or not confirmation:
            return render_template("register.html", message="Must provide Username, Password, and Confirmation!")
        
        if password != confirmation:
            return render_template("register.html", message="Password and Confirmation must match!")
        
        con, cur = database()

        cur.execute("SELECT username FROM users WHERE username = (?)", (username,))
        row = cur.fetchone()

        if row:
            return render_template("register.html", message="Username already exists!")
        
        cur.execute("INSERT INTO users(username, hash) VALUES(?, ?)", (username, generate_password_hash(password)))
        con.commit()

        cur.execute("SELECT id FROM users WHERE username = (?)", (username,))
        session["user_id"] = cur.fetchone()[0]

        cur.close()
        con.close()

        flash("You are successfully registered!")

        return redirect("/")
    
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            return render_template("login.html", message="Must provide Username and Password!")
        
        con, cur = database()

        cur.execute("SELECT * FROM users WHERE username = (?)", (username,))
        row = cur.fetchone()

        if not row:
            return render_template("login.html", message="Invalid Username!")
        
        if not check_password_hash(row[2], password):
            return render_template("login.html", message="Invalid Password!")
        
        session["user_id"] = row[0]

        cur.close()
        con.close()

        return redirect("/")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/exercises", methods=["GET", "POST"])
@login_required
def exercises():
    if request.method == "POST":
        api_url = "https://api.api-ninjas.com/v1/exercises?"

        # Searches a list of exercises that match the user's search
        if request.form.get("exercise-name"):
            name = request.form.get("exercise-name")
            results = requests.get(api_url + f"name={name}", headers={'X-Api-Key': API_KEY}).json()
            return render_template("results.html", results=results)
        
        categories = request.form.to_dict()
        exercises = []

        # Searches the list of exercises that fit the category the user is looking for
        for key, value in categories.items():
            response = requests.get(api_url + f"{key}={value}", headers={'X-Api-Key': API_KEY}).json()
            for exercise in response:
                if exercise not in exercises:
                    exercises.append(exercise)

        results = []

        # Selecting a list of exercises to exactly match the category the user is looking for
        for exercise in exercises:
            if is_sub_dict(categories, exercise):
                results.append(exercise)

        return render_template("results.html", results=results)

    return render_template("exercises.html")


@app.route("/schedules", methods=["GET", "POST"])
@login_required
def schedules():
    if request.method == "POST":
        if request.form.get("remove-exercise"):
            exercise = request.form.get("remove-exercise")
            day = request.form.get("day")

            con, cur = database()

            cur.execute("SELECT id FROM exercises WHERE user_id = (?) AND exercise = (?)", (session["user_id"], exercise))
            exercise_id = cur.fetchone()[0]

            cur.execute("SELECT * FROM schedules WHERE user_id = (?) AND exercise_id = (?)", (session["user_id"], exercise_id))
            days = cur.fetchall()

            if len(days) == 1:
                cur.execute("DELETE FROM exercises WHERE user_id = (?) AND exercise = (?)", (session["user_id"], exercise))
                con.commit()
            else:
                cur.execute("DELETE FROM schedules WHERE user_id = (?) AND exercise_id = (?) AND day = (?)", (session["user_id"], exercise_id, day))
                con.commit()

            cur.close()
            con.close()

        else:
            day = request.form.get("day")
            exercise = request.form.get("exercise")

            con, cur = database()

            cur.execute("SELECT * FROM exercises WHERE user_id = (?) AND exercise = (?)", (session["user_id"], exercise))
            row = cur.fetchall()

            if not row:
                cur.execute("INSERT INTO exercises(user_id, exercise) VALUES(?, ?)", (session["user_id"], exercise))
                con.commit()

            cur.execute("SELECT id FROM exercises WHERE user_id = (?) AND exercise = (?)", (session["user_id"], exercise))
            exercise_id = cur.fetchone()[0]

            cur.execute("INSERT INTO schedules VALUES(?, ?, ?)", (session["user_id"], exercise_id, day))
            con.commit()

            cur.close()
            con.close()

    exercises = {
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
        "sunday": [],
    }

    con, cur = database()

    for row in exercises:
        cur.execute("SELECT exercise_id FROM schedules WHERE user_id = (?) AND day = (?)", (session["user_id"], row))
        exercise_id = cur.fetchall()
        exercise_id = [id[0] for id in exercise_id]

        placeholders = ', '.join(['?' for _ in exercise_id])
        sql_query = f"SELECT exercise FROM exercises WHERE user_id = (?) AND id IN ({placeholders})"

        cur.execute(sql_query, (session["user_id"], *exercise_id))
        results = cur.fetchall()
        results = [item[0] for item in results]

        exercises[row].extend(results)

    cur.close()
    con.close()

    return render_template("add-change-schedules.html", exercises=exercises)


@app.route("/settings")
@login_required
def settings():
    return render_template("settings.html")


@app.route("/change-username", methods=["GET", "POST"])
@login_required
def change_username():
    if request.method == "POST":
        new_username = request.form.get("new-username")

        if not new_username:
            return render_template("settings.html", message1="Must provide new username!") 

        con, cur = database()

        cur.execute("SELECT * FROM users WHERE username = (?)", (new_username,))
        row = cur.fetchone()

        if row:
            return render_template("settings.html", message1="Username already exists!")
        
        cur.execute("UPDATE users SET username = (?) WHERE id = (?)", (new_username, session["user_id"]))
        con.commit()
        cur.close()
        con.close()

        flash("You have successfully changed your username!")
    
    return redirect("/settings")


@app.route("/change-password", methods=["GET", "POST"])
@login_required
def change_password():
    if request.method == "POST":
        current_password = request.form.get("current-password")
        new_password = request.form.get("new-password")
        confirmation = request.form.get("confirmation")

        if not current_password or not new_password or not confirmation:
            return render_template("settings.html", message2="Must provide current password, new password, and confirmation!")
        
        if new_password != confirmation:
            return render_template("settings.html", message2="New password and confirmation must match!")  

        con, cur = database()

        cur.execute("SELECT hash FROM users WHERE id = (?)", (session["user_id"],))
        hash = cur.fetchone()[0]

        if not check_password_hash(hash, current_password):
            return render_template("settings.html", message2="Invalid current password!")
        
        cur.execute("UPDATE users SET hash = (?) WHERE id = (?)", (generate_password_hash(new_password), session["user_id"]))
        con.commit()
        cur.close()
        con.close()

        flash("You have successfully changed your password!")

    return redirect("/settings")


@app.route("/tes")
def tes():
    return render_template("track-my-workouts.html")


if __name__ == "__main__":
    app.run(debug=True)