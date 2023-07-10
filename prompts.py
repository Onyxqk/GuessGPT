standard_prompting = """
We are going to play the game of Jotto. I have decided on a secret five letter word, and your goal is to guess that word.
You will submit five letter words as guesses, and I will tell you for each guess how many letters in your guess are also in the secret word.

PRIOR GUESSES, CORRECT LETTERS:
{prior_guesses}

YOUR GUESS:
"""

# this prompt still needs some work
tree_of_thought = """
Imagine three different experts are answering this question. All experts will write down 1 step of their thinking, then share it with the group. Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave. The question is...
We are going to play the game of Jotto. I have decided on a secret five letter word, and your goal is to guess that word.
You will submit five letter words as guesses, and I will tell you for each guess how many letters in your guess are also in the secret word.
You should carefully consider what information you've gained from each prior guess, and only make a guess when all three experts agree.

PRIOR GUESSES, CORRECT LETTERS:
{prior_guesses}

YOUR GUESS:
"""