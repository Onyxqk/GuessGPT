from tkinter import Tk     # from tkinter import Tk for Python 3.x
from tkinter.filedialog import askopenfilename
import json
import pandas

Tk().withdraw() # we don't want a full GUI, so keep the root window from appearing
filename = askopenfilename()

with open(filename, "r") as read_file:
    data = json.load(read_file)
    dataframe = pandas.DataFrame.from_dict(pandas.json_normalize(data.values()))
    print(f'Run on file: {filename}')
    print(dataframe.describe())
    print(f'Out of {len(dataframe.index)} games there were {dataframe["success"].sum()} successes.')
    print(f'The average number of letters that the model managed to match was {dataframe["highestLetterMatch"].mean()}')
    print(f'The maximum number of letters that the model managed to match was {dataframe["highestLetterMatch"].max()}')
    print(f'The average number of guesses that the model repeated was {dataframe["repeatedWordCount"].mean()}')