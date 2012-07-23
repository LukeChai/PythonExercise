#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: usingException.py
# 异常处理

# 写一个自定义异常类
class MyInputException(Exception):
    def __init__(self, length, least):
        Exception.__init__(self)
        self.length = length
        self.least = least

try:
    s = input('输入一个字符串：')
    # 如果长度小于5，触发自定义异常
    if len(s) < 5:
        raise MyInputException(len(s), 5)
except EOFError:
    print('触发EOF错误，按了Ctrl+d')
except MyInputException as x:
    print('输入的字符串只有{0}，至少需要{1}个字符'.format(x.length, x.least))
except Exception:
    print('不知道什么错误！')
finally:
    print('没有异常都会执行这里！')
