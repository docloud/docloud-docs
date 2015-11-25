# coding=utf-8

from webargs import fields
from luna import View
from luna.models import serialize
from luna.decorators import route, use_args
from ..models.doc import Document
from flask.ext.login import current_user
from flask import request
from werkzeug.utils import secure_filename


class Doc(View):
    router = "/doc"

    add_args = {
        "uid": fields.Int(required=True),
        "text": fields.Str(required=True)
    }

    def dispatch_request(self):
        pass

    @route("all")
    def get_doc(self):
        uid = current_user.id
        docs = serialize(Document.get(uid))
        return docs

    @route("add", method=["POST"])
    @use_args(add_args)
    def add(self, args):
        doc = serialize(Document.add(args))
        return doc

    del_args = {
        "id": fields.Int(required=True)
    }

    @route("del", method=["DELETE"])
    @use_args(del_args)
    def delete(self, args):
        Document.delete(args)

    update_args = {
        "id": fields.Int(required=True),
        "text": fields.Str(required=True)
    }

    @route("update", method=["PUT"])
    @use_args(update_args)
    def update(self, args):
        Document.delete(args)

    @staticmethod
    def allowed_file(filename):
        allowed_extensions = set(['md', 'word', 'pdf'])
        return '.' in filename and filename.rsplit('.', 1)[1] in allowed_extensions

    @route("upload", method=["GET", "POST"])
    def upload_file(self):
        if request.method == "POST":
            file = request.files['file']
            if file and Document.allowed_file(file.filename):
                filename = secure_filename(file.filename)

