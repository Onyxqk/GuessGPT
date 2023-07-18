from flask import Flask, render_template, request

import LLM_calls

app = Flask(__name__)
app.config['SECRET_KEY'] = "Really any string will do here since we won't deploy this"


@app.route("/", methods=("GET", "POST"))
def index():
    result = ""
    prompt_models = ['text-davinci-003', 'text-davinci-002', 'text-davinci-001']
    chat_models = ['gpt-3.5-turbo']
    model_options = chat_models + prompt_models
    if request.method == "POST":
        secret = request.form.get('secret')
        if not secret:
            result = 'You must enter a secret to run the game'
        else:
            model_selection = request.form.get('model')
            if model_selection in prompt_models:
                result = LLM_calls.standard_prompt_game(secret, model_selection)
            else:
                result = LLM_calls.chat_completion_game(secret, model_selection)
    return render_template('guessGPT.html', result=result, model_options=model_options)
