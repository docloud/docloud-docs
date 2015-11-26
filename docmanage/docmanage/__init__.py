# coding=utf8

"""
Copyright 2015 docmanage
"""

from luna.hooks import hook
from luna import app


@hook
def api_loader():
    from .api import __all__
    from auth import auth_init
    auth_init(app)
    return __all__