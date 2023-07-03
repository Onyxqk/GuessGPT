from langchain.llms import OpenAI
import os
import config
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

import prompts

os.environ["OPENAI_API_KEY"] = config.OPENAI_API_KEY

llm = OpenAI(max_tokens=1000)

def format_prior_guesses(prior_guesses):
    if len(prior_guesses) == 0:
        return "N/A"
    prompt_string = ""
    for guess, correct_letters in prior_guesses:
        prompt_string += f'{guess}, {correct_letters}\n'
        
def standard_prompt_request(prior_guess_string):
    prompt = PromptTemplate.from_template(prompts.standard_prompting)

    chain = LLMChain(llm=llm, prompt=prompt)
    response = chain.run(prior_guess_string)
    return response
    
secret_word = "apple"    # Static secret word for development, apple is something it consistently guesses. Try 'token' for something it seems to struggle with
secret_word_set = set(secret_word.upper())
latest_guess = ""
attempts = 0
MAX_ATTEMPTS = 10
prior_guesses = []

while attempts < MAX_ATTEMPTS and latest_guess.upper() != secret_word.upper():
    attempts += 1
    latest_guess = standard_prompt_request(format_prior_guesses(prior_guesses))
    correct_letters = len(secret_word_set.intersection(set(latest_guess.upper())))
    print(f'{latest_guess}, {correct_letters}')
    
if latest_guess.upper() == secret_word.upper():
    print('Secret word successfully guessed')
else:
    print('Model failed to guess the secret')