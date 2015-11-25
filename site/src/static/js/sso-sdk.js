/**
 * Created by yufeili on 15/11/25.
 */

;(function($) {
    var defaultConfig = {
        user: null,
        token: null,
        sso_service: 'http://127.0.0.1:8001',
        sso_url: 'http://127.0.0.1:3001'
    };
    $.sso = $.extend({}, defaultConfig);

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    };

    var setup = function(config) {
        $.sso = $.extend($.sso, config);
    };

    var init = function () {
        $.sso.token = $.urlParam("token");
        if ($.sso.token == null) {
            window.location.href = $.sso.sso_url;
        } else {
            load_user($.sso.token);
        }
    };

    var load_user = function (token) {
        return $.ajax({
            url: $.sso.sso_service + '/sso/user',
            type: "get",
            async: false,
            headers: {
                Authorization: token
            }
        }).done(function (data) {
            $.sso.user = data;
        }).error(function (data) {
            window.location.href = $.sso.sso_url;
        });
    };

    var login = function (login_data) {
        return $.ajax({
            url: $.sso.sso_service + '/sso/login',
            type: "post",
            async: false,
            data: login_data
        }).done(function (data) {
            $.sso.token = data.token;
            load_user(token);
        });
    };

    $.sso = $.extend({
        setup: setup,
        init: init,
        login: login,
        load_user: load_user
    }, $.sso);
})(jQuery);
