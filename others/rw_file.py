#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename rw_file.py

# r 读取模式
# w 写入模式
# a 追加模式
# r+ 读写模式
f = open('test.txt', 'r')
print f.read()

f.seek(0)
print f.read(14)

f.seek(0)
print f.readline()
print f.readline()

f.seek(0)
print f.readlines()

f.seek(0)
for line in f:
    print line,

f.close()

print '\n', '-'*20

f = open('test.txt', 'r+')
f.truncate()
f.write('0123456789abcd')

f.seek(3)
print f.read(1)
print f.read(2)
print f.tell()

f.seek(3, 1)
print f.read(1)

f.seek(-3, 2)
print f.read(1)

f.close()

print '-'*20

f = open('test.txt')
print '文件名：', f.name
print '是否处于关闭状态：', f.closed
print '打开的模式:', f.mode
