#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename app.py

import web, time
import db, simplejson
from bookinn import map

web.config.debug = False

urls = ('/(.*)/', 'redirect',
        '/', 'Index',
        '/login', 'Login',
        '/logout', 'Logout',
        '/inn/(.+)', 'Inn')

app = web.application(urls, globals())
session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'username': None, 'loggedin': False})

render = web.template.render('templates/', base = 'layout')
render_nobase = web.template.render('templates/')

class Index(object):
    def GET(self):
        return render.index(session = session)
            
class Login(object):
    def POST(self):
        form = web.input()
        cond = dict(name=form.username)
        results = db.master.select('user', cond, where='name = $name')
        if len(results) == 0:
            # user no found
            return simplejson.dumps({'code': 1, 'msg': '用户名不对哦!'})
        else:
            user = results[0]
            if user.pwd != form.password:
                # password no match
                return simplejson.dumps({'code': 1, 'msg': '密码不对哦!'})
            else:
                # login successfully
                session.id = user.id
                session.username, session.loggedin = form.username, True
                return simplejson.dumps({'code': 0})     

class Logout(object):
    def GET(self):
        session.loggedin = False
        session.kill()
        web.seeother("/")
    
    def POST(self):
        return self.GET()

class Inn(object):
    def GET(self, func):
        if func == 'config_inn':
            return self.config_inn()

    def config_inn(self):
        form = web.input()
        cond = dict(innid=int(form.id))
        inn_results = db.master.select('inn', cond, where='id = $innid')
        inn = None;
        if len(inn_results) != 0:
            inn = inn_results[0]
            cond = dict(innid=int(inn.id))
            room_results = db.master.select('room', cond, where='innid = $innid', order='orderno asc')
            inn.rooms = list(room_results)
        return render_nobase.ainn(inn=inn)
        
    def POST(self, func):     
        if func == 'get_inn_summary':
            return self.get_inn_summary()
        elif func == 'update_remain_room':
            return self.update_remain_room()
        elif func == 'save_inn_config':
            return self.save_inn_config()
        else:
            print 'not found!'
    
    def get_inn_summary(self):
        cond = dict(id=int(session.id))
        inn_results = db.master.select('inn', cond, where='userid = $id', order='orderno asc')
        inns = list(inn_results)
        for inn in inns:
            cond = dict(innid=int(inn.id))
            room_results = db.master.select('room', cond, where='innid = $innid', order='orderno asc')
            inn.rooms = list(room_results)
        return render_nobase.inns(inns=inns)

    def update_remain_room(self):
        try:
            form = web.input()
            now_time = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
            cond = dict(roomid=int(form.id))
            db.master.update('room', vars=cond, where='id = $roomid', remain=int(form.remain), updatedtime=now_time)
            return simplejson.dumps({'code': 0, 'updatedtime': now_time})
        except:
            return simplejson.dumps({'code': 1})

    def save_inn_config(self):
        try:
            form = web.input()
            insertData, updateData, deleteData = form.insertData, form.updateData, form.deleteData
            now_time = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
            if len(insertData) != 0:
                lineDatas = insertData.split(';')
                for lineData in lineDatas:
                    columnDatas = lineData.split('|')
                    db.master.insert('room', innid=int(form.innid), roomname=columnDatas[0], remain=int(columnDatas[1]), orderno=columnDatas[2], updatedtime=now_time)
            if len(updateData) != 0:                         
                lineDatas = updateData.split(';')
                for lineData in lineDatas:
                    columnDatas = lineData.split('|')
                    cond = dict(roomid=int(columnDatas[0]))
                    db.master.update('room', vars=cond, where='id = $roomid', roomname=columnDatas[1], remain=int(columnDatas[2]), orderno=columnDatas[3], updatedtime=now_time)
            if len(deleteData) != 0:
                lineDatas = deleteData.split(';')
                for lineData in lineDatas:
                    cond = dict(roomid=int(lineData))
                    db.master.delete('room', vars=cond, where='id = $roomid')
            return simplejson.dumps({'code': 0})
        except:
            return simplejson.dumps({'code': 1})

def notfound():
    return web.notfound("Sorry, the page you were looking for was not found.")
    # You can use template result like below, either is ok:
    # return web.notfound(render.notfound())
    # return web.notfound(str(render.notfound()))

app.notfound = notfound

class redirect(object):
    def GET(self, path):
        web.seeother('/' + path)

if __name__ == '__main__':
    app.run()

