#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename using_pickle.py
# 使用存储器

# 加载存储器模块，as后面是别名
# import pickle as p
# 书上说cPickle比pickle快很多
import pickle as p

listpickle = [1, 2, 2, 3]
picklefile = 'picklefile.data'

f = open(picklefile, 'wb')
# 写数据
p.dump(listpickle, f)
f.close()

del listpickle

f = open(picklefile, 'rb')
# 读取数据
storedlist = p.load(f)
print(storedlist)
