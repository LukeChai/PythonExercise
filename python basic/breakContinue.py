#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename breakContinue.py
# break和continue的用法

while True:
    s = input('输入一个字符串：')
    if s == 'quit':
        break
    elif len(s) < 4:
        print('输入的字符串太短！')
        continue
    else:
        print('你说：', s)
