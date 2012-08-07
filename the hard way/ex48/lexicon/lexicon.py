#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename lexicon.py

dict = {
    'direction': ['north', 'south', 'east', 'west', 'down', 'up', 'left', 'right', 'back'],
    'verb': ['go', 'stop', 'kill', 'eat'],
    'stop': ['the', 'in', 'of', 'from', 'at', 'it'],
    'noun': ['door', 'bear', 'princess', 'cabinet']
}

def convert_number(s):
    try:
        return int(s)
    except ValueError:
        return None

def scan(sentence):
    result = []
    words = sentence.split(' ')
    for word in words:
        find = False
        
        word_number = convert_number(word)
        if word_number != None:
            find = True
            result.append(('number', word_number))
            continue
        for key in dict.keys():
            if word in dict[key]:
                find = True
                result.append((key, word))
                continue
        if find == False:
            result.append(('error', word))

    return result

