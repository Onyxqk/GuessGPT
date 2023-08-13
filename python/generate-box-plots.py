import re
import os
import seaborn
import matplotlib.pyplot as plot
from tkinter import Tk     # from tkinter import Tk for Python 3.x
from tkinter.filedialog import askopenfilenames
import json
import pandas

Tk().withdraw()  # we don't want a full GUI, so keep the root window from appearing
frames = []

filenames = askopenfilenames()
for i, filename in enumerate(list(filenames)):
    with open(filename, "r") as read_file:
        data = json.load(read_file)
        dataframe = pandas.DataFrame.from_dict(
            pandas.json_normalize(data.values()))
        file = os.path.basename(filename).split('/')[-1]
        dataframe["file"] = re.search('game_results-(.+?).json', file).group(1)
        frames.append(dataframe)

all_frames = pandas.concat(frames)
print(all_frames)

fig, axs = plot.subplots(nrows=2)
for ax in axs:
    ax.yaxis.grid(True, linestyle='-', which='major', color='lightgrey', alpha=0.5)
    ax.set_xticklabels(filenames, rotation=45, fontsize=8)
fig.subplots_adjust(bottom=0.2, hspace=1)
# all_frames.boxplot(column="repeatedWordCount", ax=axs[0], by="file")
# all_frames.boxplot(column="highestLetterMatch", ax=axs[1], by="file")
seaborn.boxplot(data=all_frames, x="file", y="repeatedWordCount", ax=axs[0], showmeans=True, meanprops={"marker":"o",
                       "markerfacecolor":"white", 
                       "markeredgecolor":"black",
                      "markersize":"5"})
seaborn.boxplot(data=all_frames, x="file", y="highestLetterMatch", ax=axs[1], showmeans=True, meanprops={"marker":"o",
                       "markerfacecolor":"white", 
                       "markeredgecolor":"black",
                      "markersize":"5"})
fig.text(0.90, 0.09, f'White circles denote means',
         backgroundcolor='grey', color='white', weight='roman',
         size='x-small')
plot.show()
