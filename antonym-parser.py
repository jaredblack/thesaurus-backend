import json
import random

in_file = open('antonyms.txt', 'r')
lines = [line for line in in_file.read().split('\n')]

words = []
for line in lines:
    word, antonym = line.split()
    words.append({"word": word.lower(), "antonym": antonym.lower()})

random.shuffle(words)

with open("antonyms.json", "w") as write_file:
    json.dump(words, write_file)