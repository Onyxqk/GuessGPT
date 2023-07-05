from flask import Flask
from flask import render_template

import LLM_calls

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('guessGPT.html')
    
@app.route("/standard_prompt")
def standard_prompt():
    return LLM_calls.standard_prompt_game('apple')