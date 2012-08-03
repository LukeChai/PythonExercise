#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename ex42_class.py
# Class

## Animal is-a object (yes, sort of confusing) look at the extra credit
class Animal(object):
    pass

## ?? is-a
class Dog(Animal):
    def __init__(self, name):
        ## ?? has-a
        self.name = name

## ?? is-a
class Cat(Animal):
    def __init__(self, name):
        ## ?? has-a
        self.name = name

## ?? is-a
class Person(object):
    def __init__(self, name):
        ## ?? has-a
        self.name = name
        ## Person has-a pet of some kind
        self.pet = None

## ?? has-a
class Employee(Person):
    def __init__(self, name, salary):
        ## ?? hmm what is this strange magic?
        super().__init__(name)
        ## ?? has-a
        self.salary = salary

## ?? is-a
class Fish(object):
    pass

## ?? is-a
class Salmon(Fish):
    pass

## ?? is-a
class Halibut(Fish):
    pass

## rover is-a Dog
rover = Dog("Rover")

## ?? is-a
satan = Cat("Satan")

## ?? is-a
mary = Person("Mary")

## ?? is-a
mary.pet = satan

## ?? is-a
frank = Employee("Frank", 120000)

## ?? is-a
frank.pet = rover
