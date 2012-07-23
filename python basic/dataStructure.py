#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: dataStructure.py
# 数据结构

# 列表的基本操作
a = [3, 2, 34, 12.3]
print(a)
# 添加一个元素到列表后面
a.append(15)
print(a)
# 查看元素的位置
print(a.index(34))
# 移除一个元素
a.remove(2)
print(a)
# 翻转列表
a.reverse()
print(a)
# 排序
a.sort()
print(a)

# 元组的基本操作，元组的值不会被改变
b = ("a", "b", "c")
print(b)
print(len(b))
# 下表从0开始计算
print(b[1])

# 字典，一种键和值对应的数据结构，键是唯一的
c = {"a" : "aaa", "b" : "bbb", "c" : "ccc"}
print(c)
print(c["a"])
del c["b"]
c["d"] = "ddd"
for name, value in c.items():
    print(name, value)
if "d" in c:
    print("d is in c")

# 列表，元组和字符串都是序列，序列的特点就是索引操作和切片操作
d = "world"
print(d[0])
print(d[1])
print(d[-1])
e = ["a", "b", "c", "d"]
print(e[:])
print(e[1:2])
print(e[0:-1])
print(e[2:])

# 引用和复制
f = [1, 2, 3, 4]
# 引用，指向相同的内存块
g = f
print(f)
print(g)
del f[0]
print(f)
print(g)
# 复制
h = f[:]
del f[0]
print(f)
print(h)

# 更多字符串操作
i = "world"
if i.startswith("wor"):
    print("i starts with 'wor'")
if "o" in i:
    print("'o' is in i")
if i.find("ld"):
    print("'ld' is found in i")
# 使用分隔符分隔列表的值
delimiter = "_"
j = ["a", "b", "c"]
print(delimiter.join(j))
