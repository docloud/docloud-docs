/*
 Copyright 2015 SSO Project
 */


var Bootstrap = require("bootstrap");

$(document).ready(function () {
    var environ = {
        user: null,
        title: "文档管理中心",
        url: "http://127.0.0.1:3002",
        dash: "#dashboard"
    };

    var state = {
        login_success: function (data) {
            $.cherry.environ.token = data.token;
            console.log(data.token);
            $.cookie("Authorization", data.token);
            $($.cherry.environ.dash).switch_page("#auth-page", {services: services});
        },
        logout: function() {
            $.removeCookie("Authorization");
            $.cherry.switch_page("#login-form");
        },
        error: function (data) {
            $($.cherry.environ.dash).switch_page("#error-page", data.responseJSON);
        }
    };

    $.sso.init({
        sso_url: 'http://127.0.0.1:3001'
    });
    //$.cherry.setup(environ, state);

});
