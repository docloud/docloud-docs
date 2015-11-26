# coding=utf-8

from webargs import fields
from luna import View
from luna.models import serialize
from luna.decorators import route, use_args
from docmanage.exceptions import Error
from ..models.doc import Document
from flask.ext.login import current_user, login_required
from flask import request, make_response
from werkzeug.utils import secure_filename
from jenny import compile
import mimetypes


class Doc(View):
    router = "/doc"
    decorators = [login_required]

    add_args = {
        "uid": fields.Int(),
        "doc_name": fields.Str(required=True),
        "text": fields.Str(required=True)
    }

    def dispatch_request(self):
        pass

    @route("all")
    def get_doc(self):
        uid = current_user.id
        docs = serialize(Document.get(uid))
        return docs

    @route("add", methods=["POST"])
    @use_args(add_args)
    def add(self, args):
        if not args.get("uid"):
            args["uid"] = current_user.id
        doc = serialize(Document.add(args))
        return doc

    del_args = {
        "id": fields.Int(required=True)
    }

    @route("del", methods=["DELETE"])
    @use_args(del_args)
    def del_doc(self, args):
        print(args)
        Document.delete(args['id'])

    update_args = {
        "id": fields.Int(required=True),
        "text": fields.Str(required=True)
    }

    @route("update", methods=["PUT"])
    @use_args(update_args)
    def update(self, args):
        Document.update(**args)

    @staticmethod
    def allowed_file(filename):
        allowed_extensions = {'md'}
        return '.' in filename and filename.rsplit('.', 1)[1] in allowed_extensions

    @route("upload", methods=["POST"])
    def upload_file(self):
        print(request.files)
        up_file = request.files['file']
        if up_file and Doc.allowed_file(up_file.filename):
            uid = current_user.id
            # filename = secure_filename(up_file.filename)
            # print(filename)
            text = up_file.read()
            print(up_file.filename)
            print(text)
            Document.add({'uid': uid, 'doc_name': up_file.filename, 'text': text})
        else:
            raise Error(Error.FILE_ILLEGAL)

    @route("transform", methods=["GET"])
    @use_args({
        "id": fields.Int(required=True),
        "out_format": fields.Str(requied=True)
    })
    def transform(self, args):
        text = Document.get_content_by_doc_id(args['id'])
        text = compile(text, 'markdown', args['out_format'])
        resp = make_response(text)
        print(current_user.is_authenticated)
        resp.headers["Content-Type"] = mimetypes.types_map.get('.' + args['out_format'],
                                                               "application/octet-stream")
        return resp



