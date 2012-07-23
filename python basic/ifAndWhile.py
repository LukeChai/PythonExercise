#!/usr/bin/python  
# -*- coding: utf-8 -*-  
# Filename ifAndWhile.py  
# 猜数字游戏，演示if和while的用法  
  
result = 18  
running = True  
  
while running:  
    guess = int(input('输入一个数字：'))  
      
    if guess == result:  
        print('恭喜，你猜对了！')
        running = False  
    elif guess < result:  
        print('太小了！')
    elif guess > result:  
        print('太大了！')
    else:  
        print('未知错误！')
  
print('游戏结束！')
