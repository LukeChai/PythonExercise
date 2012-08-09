#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename setup.py
# 安装

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

cofig = {
    'description': 'ex47',
    'author': 'Luke Chai',
    'url': 'URL to get it at.',
    'download_url': 'Where to download it.',
    'author_email': 'lukechai@outlook.com',
    'version': '0.1',
    'install_requires': ['nose'],
    'packages': ['NAME'],
    'scripts': [],
    'name': 'ex47'
}

setup(**config)
