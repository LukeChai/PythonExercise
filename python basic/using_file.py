#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: using_file.py
# 文件的创建和读取

s = '''我们都是木头人，
不许说话不许动！'''

# 创建一个文件，并且写入字符
f = open('test_file.txt', 'w')
f.write(s)
f.close

# 读取文件，逐行打印
f = open('test_file.txt')
while True:
    line = f.readline()
    # 如果line长度为0，说明文件已经读完
    if len(line) == 0:
        break
    # 默认的换行符也读出来了，所以用逗号取代print函数的换行符
    print(line, end=" ", sep="")
f.close()
