#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename db.py
# 数据库辅助

import web, settings

master = web.database(dbn = settings.DB_MASTER_TYPE,
                      host = settings.DB_MASTER_HOST,
                      db = settings.DB_MASTER_NAME,
                      user = settings.DB_MASTER_USER,
                      pw = settings.DB_MASTER_PASSW)
