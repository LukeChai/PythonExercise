#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename ex44_extend.py
# 继承

class Parent(object):
    def implicit(self):
        print("parent implicit()")
    def override(self):
        print("parent override()")
    def altered(self):
        print("parent altered()")

class Child(Parent):
    def override(self):
        print("child override()")
    def altered(self):
        print("child, before parent altered()")
        super().altered()
        print("child, after parent altered()")

dad = Parent()
son = Child()

dad.implicit()
son.implicit()

dad.override()
son.override()

dad.altered()
son.altered()
