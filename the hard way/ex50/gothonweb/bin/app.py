#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename app.py

import web
from gothonweb import map

urls = ('/(.*)/', 'redirect',
        '/', 'Index',
        '/import', 'ImportAction',
        '/game', 'GameEngine')

app = web.application(urls, globals())

# litter hack so that debug mode works with sessions
if web.config.get('_session') is None:
    store = web.session.DiskStore('sessions')
    session = web.session.Session(app, store, initializer={'room': None})

    web.config._session = session
else:
    session = web.config._session

render = web.template.render('templates/', base = "layout")

class Index(object):
    def GET(self):
        # this is used to "setup" the session with starting values
        session.room = map.START
        web.seeother("/game")
    
    def POST(self):
        form = web.input(name = "Nobody", greet = "Hello")
        greeting = "%s, %s" % (form.greet, form.name)
        return render.index(greeting = greeting)

class ImportAction(object):
    def GET(self):
        return render.file_import()
    
    def POST(self):
        form = web.input(myfile={})
        data = form['myfile'].file.read()
        f = open('/test.txt' ,'w')
        f.write(data)
        f.close()
        return render.index(greeting="successful")

class GameEngine(object):
    def GET(self):
        if session.room:
            return render.show_room(room=session.room)
        else:
            # Why is there here? do you need it?
            return render.you_died()

    def POST(self):
        form = web.input(action=None)

        if session.room and form.action:
            session.room = session.room.go(form.action)
        else:
            session.room = None

        web.seeother("/game")

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

