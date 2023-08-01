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

        cur.execute("SELECT username FROM users WHERE username = ?", username)
        row = cur.fetchall()

        if row:
            return render_template("register.html", message="Username already exists!")
        
        cur.execute("INSERT INTO users(username, hash) VALUES(?, ?)", username, generate_password_hash(password))
        con.commit()

        cur.execute("SELECT id FROM users WHERE username = ?", username)
        user_id = cur.fetchone()[0]
        session["user_id"] = user_id

        cur.close()
        con.close()

        flash("You are successfully registered!")

        return redirect("/")
    
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")


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


@app.route("/schedules")
@login_required
def schedules():
    return render_template("/schedules")


@app.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    return render_template("/settings")


if __name__ == "__main__":
    app.run(debug=True)