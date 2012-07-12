#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: my_module.py
# 自定义的模块

# 区分是自己调用还是被其他程序调用
if __name__ == '__main__':
    print('自己执行')
else:
    print('被调用执行')

# 定义一个方法一个变量
def myfunc():
    print('我是my_module中的方法myfunc')
version = '1.0'
