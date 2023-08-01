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
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/exercises", methods=["GET", "POST"])
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
def schedules():
    return render_template("/schedules")


@app.route("/settings", methods=["GET", "POST"])
def settings():
    return render_template("/settings")


if __name__ == "__main__":
    app.run(debug=True)