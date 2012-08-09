#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename sentence_tests.py

from nose.tools import *
from lexicon.sentence import *

def test_peek():
    assert_equal(peek([('noun', 'bear')]), 'noun')
    assert_equal(peek([('verb', 'go')]), 'verb')

def test_match():
    assert_equal(match([('noun', 'bear')], 'noun'), ('noun', 'bear'))
    assert_equal(match([('noun', 'bear')], 'verb'), None)

def test_skip():
    l = [('stop', 'the'), ('noun', 'bear')]
    skip(l, 'stop')
    assert_equal(peek(l), 'noun')

def test_parse_verb():
    assert_equal(parse_verb([('verb', 'go')]), ('verb', 'go'))
    assert_raises(ParserError, parse_verb, [('noun', 'bear')])

def test_parse_object():
    assert_equal(parse_object([('direction', 'north')]), ('direction', 'north'))
    assert_raises(ParserError, parse_object, [('verb', 'kill')])

def test_parse_subject():
    s = parse_subject([('verb', 'kill'),('noun', 'princess')], ('noun', 'player'))
    assert_equal(s.subject, 'player')
    assert_equal(s.verb, 'kill')
    assert_equal(s.object, 'princess')

def test_parse_sentence():
    s = parse_sentence([('verb', 'kill'),('noun', 'bear')])
    assert_equal(s.subject, 'player')
    assert_equal(s.verb, 'kill')
    assert_equal(s.object, 'bear')
    assert_raises(ParserError, parse_sentence, [('direction', 'north')])
