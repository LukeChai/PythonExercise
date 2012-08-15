#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename app_tests.py

from nose.tools import *
from bin.app import app
from gothonweb import map
from tests.tools import assert_response

def test_index():
    # check that we get a 404 on the / URL
    resp = app.request("/")
    assert_response(resp, status="303")

    # make sure default values work for the form
    #resp = app.request("/game", method="GET")
    #assert_response(resp, contains=map.START)

    # test that we get expected values
    #data = {'action': 'shoot!'}
    #resp = app.request("/game", method="POST", data=data)
    #assert_response(resp, contains="Zed")
