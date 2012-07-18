#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: SchoolMember.py
# 面向对象的实例，学校成员类

class SchoolMember:
    # 总人数，这个是类的变量
    sum_member = 0

    # __init__方法在类的对象被创建时执行
    def __init__(self, name):
        self.name = name
        SchoolMember.sum_member += 1
        print("学校新加入一个成员：", self.name)
        print("现在有成员{0}人".format(SchoolMember.sum_member))

    # 自我介绍
    def say_hello(self):
        print("大家好，我叫：", self.name)

    # __del__方法在对象不适用的时候运行
    def __del__(self):
        SchoolMember.sum_member -= 1
        print("{0}离开了，学校还有{1}人".format(self.name, SchoolMember.sum_member))

# 老师类继承学校成员类
class Teacher(SchoolMember):
    def __init__(self, name, salary):
        SchoolMember.__init__(self, name)
        self.salary = salary

    def say_hello(self):
        SchoolMember.say_hello(self)
        print("我是老师，我的工资是：", self.salary)

    def __del__(self):
        SchoolMember.__del__(self)

# 学生类
class Student(SchoolMember):
    def __init__(self, name, mark):
        SchoolMember.__init__(self, name)
        self.mark = mark

    def say_hello(self):
        SchoolMember.say_hello(self)
        print("我是学生，我的成绩是：", self.mark)

    def __del__(self):
        SchoolMember.__del__(self)

t = Teacher("老黄", 3000)
t.say_hello()
s = Student("小河", 77)
s.say_hello()
