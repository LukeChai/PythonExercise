#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: for.py
# 计算1到10的和，演示for的用法

result = 0

for i in range(1, 11):
    result = result + i

print(result)

# 计算1到10中奇数的和

result = 0

for i in range(1, 11, 2):
    result = result + i

print(result)
