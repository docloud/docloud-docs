# coding=utf8

"""
Copyright 2015 docmanage
"""

from luna.hooks import hook


@hook
def api_loader():
    from .api import __all__

    return __all__