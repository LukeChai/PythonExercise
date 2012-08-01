#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename ex33_while.py
# while用法

i = 0
numbers = []

while i < 6:
    print("At the top i is %d" % i)
    numbers.append(i)

    i = i + 1
    print("Numbers now: ", numbers)
    print("At the bottom i is %d" % i)

print("The numbers: ")

for num in numbers:
    print(num)

def while_function(i):
    j = 0
    numbers = []

    while j < i:
        numbers.append(j)
        j += 1

    return numbers

numbers = while_function(6)

def for_function(i, increment):
    numbers = []
    for j in range(0, i, increment):
        numbers.append(j)
    return numbers

numbers = for_function(6, 2)
