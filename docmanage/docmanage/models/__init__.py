# coding=utf8

"""
Copyright 2015 docmanage
"""

from luna.models import db, rsdb

if rsdb:
    session = rsdb.session
    ModelBase = rsdb.Model