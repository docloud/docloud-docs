/*
 Copyright 2015 SSO Project
 */


var Bootstrap = require("bootstrap");

$(document).ready(function () {
    $.sso.init({
        sso_url: 'http://139.196.37.224/sso',
        sso_service: 'http://139.196.37.224:8001'
    });

    var environ = {
        sso: $.sso,
        title: "文档管理中心",
        url: "http://127.0.0.1:3002",
        dash: "#dashboard",
        services: {
            docmanage: "http://139.196.37.224:8002"
        }
    };

    var state = {
        logout: function () {
            $.removeCookie("Authorization");
            $.sso.go();
        },
        docs: function () {
            return $.ajax({
                url: environ.services.docmanage + '/doc/all',
                type: "get",
                async: true,
                headers: {
                    Authorization: $.sso.token
                }
            }).done(function (data) {
                $.cherry.switch_page("#docs-page", data);
            });
        },
        delete: function (context) {
            console.log(context);
            $.ajax({
                url: environ.services.docmanage + '/doc/del',
                type: "delete",
                async: true,
                headers: {
                    Authorization: $.sso.token
                },
                data: context
            }).done(function (data) {
                alert("删除成功");
                $.cherry.set_state("docs");
            });
        },
        done: function (data) {
            $($.cherry.environ.dash).switch_page("#done-page", {});
        },
        error: function (data) {
            $($.cherry.environ.dash).switch_page("#error-page", data.responseJSON);
        }
    };

    $.cherry.setup(environ, state);
    $("#nav").switch_page("#nav-page", {});
    $.cherry.set_state("docs");
});
