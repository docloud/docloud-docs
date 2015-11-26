# coding=utf8

"""
Copyright 2015 docmanage
"""

from webargs.flaskparser import parser


@parser.error_handler
def argerror_handler(e):
    raise Error(Error.ARGUMENT_ERROR, e.message)


class Error(Exception):
    """
    User custom error
    """
    " 0 ~ 1000 System Error "
    BOOTSTRAP_ERROR = 0
    ARGUMENT_ERROR = 1

    " 1000 ~ fin User Error "
    DOC_NOT_FOUND = 1000
    DOC_EXISTED = 1001

    FILE_ILLEGAL = 1002

    translate = {
        BOOTSTRAP_ERROR: u'系统内部错误',
        ARGUMENT_ERROR: u'参数错误',

        DOC_NOT_FOUND: u'文档不存在',
        DOC_EXISTED: u'文档已存在',

        FILE_ILLEGAL: u'文件不合法'
    }

    def __init__(self, code=0, message=""):
        self.error_code = code
        self.message = message or self.translate.get(self.error_code)

    def __str__(self):
        return self.message.encode('utf8')