#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename rw_cvs.py

import csv

csvfile = file('csv_test.csv', 'wb')
writer = csv.writer(csvfile)
writer.writerow(['姓名', '年龄', '电话'])

data = [('小河', '25', '1234567'),
        ('小芳', '18', '789456')]
writer.writerows(data)

csvfile.close()

csvfile = file('csv_test.csv', 'rb')
reader = csv.reader(csvfile)

for line in reader:
    print line

csvfile.close()
