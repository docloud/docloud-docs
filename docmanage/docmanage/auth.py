#!/usr/bin/env python
# coding=utf8

"""
Copyright 2015 Luna Project

Authorazition use :mod:`flask.login`
"""

from flask.ext.login import (
    LoginManager,
    login_user,
    logout_user,
    login_required,
    current_user,
    UserMixin
)
from flask.ext.principal import (
    Principal,
    Identity,
    AnonymousIdentity,
    identity_changed
)
import requests

login_manager = LoginManager()


class User(UserMixin):
    def __init__(self, token=None):
        self.auth_token = token
        self.id = None
        self.name = None
        self.suspended = None

        self.load_user_from_token(token)

    def load_user_from_token(self, token):
        user = requests.get('/sso/user', headers={'Authorization': token}).json()
        if user.status_code == 200:
            self.id = user.id

    def is_authenticated(self):
        return bool(self.id)

    @property
    def is_active(self):
        return self.is_authenticated and not self.suspended

    @property
    def is_anonymous(self):
        return not bool(self.id)

    def get_id(self):
        return unicode(self.id)


@login_manager.request_loader
def load_user_from_request(request):
    # 从headers里加载Authorization Token
    token = request.headers.get('Authorization')

    if not token:
        token = request.cookies.get('Authorization')

    if token:
        return User(token=token)
    else:
        return None


def auth_init(app):
    Principal(app)
    login_manager.init_app(app)
