#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename ex31_elif.py
# if嵌套

print("You enter a dark room with two doors. Do you go through door #1 or door #2?")

door = input("> ")

if door == "1":
    print("There's a giant bear here eating a cheese cake, what do you do?")
    print("1. Take the cake.")
    print("2. Screen at the bear.")

    bear = input("> ")

    if bear == "1":
        print("The bear eats your face off. Good job!")
    elif bear == "2":
        print("The bear eats your legs off. Good job!")
    else:
        print("Well, doing %s id probably better. Bear runs away." % bear)

elif door == "2":
    print("You stare into the endless abyss at Cthulhu's retina.")
    print("1. Blueberries.")
    print("2. Yellow jacket clothespins.")
    print("3. Understanding revolvers yelling molodies.")

    insanity = input("> ")

    if insanity == "1" or insanity == "2":
        print("Your body survies powered by a mind of jello. Good job!")
    else:
        print("The insanity rots your eyes into a pool of muck. Good job!")

else:
    print("You stumble around and fall on a knike and die. Good job!")
