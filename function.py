#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename function.py
# 函数

# 一个简单的函数，用def定义函数
def sayHello():
    print('你好！')
sayHello()

# 代参数的函数
def printMin(a, b):
    if a < b:
        print(a, '比较小')
    else:
        print(b, '比较小')
printMin(2, 5)

# 局部变量和全局变量
def func(x):
    x = 10
    print('x是局部变量：', x)
    global y
    y = 10
    print('y是全局变量：', y)
x = 1
y = 1
func(x)
print('x还是：', x)
print('y已经变为：', y)

# 默认参数和关键参数
def func2(a, b=1, c=2):
    print('a=', a, 'b=', b, 'c=', c)
func2(5)
func2(5, 6)
func2(c=10, a=12)
# func2(b=5) a的值必须定义

# 返回值
def func3(a):
    return a
print(func3(5))

# 函数说明 惯例是第一行为简介，第二行空，第三行开始详细描述
# 用print 函数名.__doc__可以打印这些信息
def printMax(x, y):
    '''''打印两个数种的比较大地一个.

    这两个参数必须是整形。'''
    x = int(x)
    y = int(y)
    if x > y:
        print(x)
    else:
        print(y)
printMax(3, 6)
print(printMax.__doc__)
