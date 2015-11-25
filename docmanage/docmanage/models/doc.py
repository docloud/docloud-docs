# coding=utf-8

from sqlalchemy.exc import IntegrityError
from sqlalchemy import Integer, Column, Text, DateTime
from . import ModelBase, Session
from sqlalchemy.orm.exc import NoResultFound
from ..exceptions import Error
from datetime import datetime


class Document(ModelBase):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(Integer)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    @classmethod
    def get(cls, uid):
        return Session().query(cls).filter_by(uid=uid).all()

    @classmethod
    def add(cls, doc_data):
        doc = cls(**doc_data)
        session = Session()
        session.add(doc)
        try:
            session.commit()
        except IntegrityError as e:
            if e.orig[0] == 1062:
                raise Error(Error.DOC_EXISTED)
        return doc

    @classmethod
    def delete(cls, doc_id):
        session = Session()
        doc = session.query(cls).filter_by(id=doc_id)
        if doc.first():
            doc.delete()
            session.commit()
        else:
            raise Error(Error.DOC_NOT_FOUND)

    @classmethod
    def update(cls, doc_id, text):
        session = Session()
        doc = session.query(cls).filter_by(id=doc_id)
        try:
            doc.one().text = text
            session.commit()
        except NoResultFound:
            raise Error(Error.DOC_NOT_FOUND)



