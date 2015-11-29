/**
 * Created by yufeili on 15/11/25.
 */

var Handlebars = require("handlebars");

Handlebars.registerHelper('stringify', function (obj) {
    return JSON.stringify(obj);
});

Handlebars.registerHelper('parse', function (obj) {
    return JSON.parse(obj);
});

Handlebars.registerHelper('slice', function (str, n) {
    return str.slice(n);
});

(function ($) {
    var compile_template = function (selector, context) {
        context._environ = $.cherry.environ;
        var source = $(selector).html();
        var template = Handlebars.compile(source);
        return template(context);
    };

    var switch_page = function (selector, context, container) {
        //context = (context == undefined) ? {} : JSON.parse(context);
        container = (container == undefined) ? $.cherry.environ.dash : container;
        var html = compile_template(selector, $.extend({}, context));
        $(container).hide();
        $(container).html(html).slideDown("fast");
    };

    var set_state = function (state, context) {
        if (context == undefined) {
            $.cherry.state[state]();
        } else {
            //context = JSON.parse(context);
            $.cherry.state[state](context);
        }
    };

    $.cherry = {
        compile_template: compile_template,
        switch_page: switch_page,
        set_state: set_state
    };

    $.cherry.default = {};
    $.cherry.default.environ = {
        title: "Cherry Project",
        url: "http://127.0.0.1:8001",
        dash: "#dashboard"
    };

    $.cherry.default.state = {
        loading: function () {
            var html = '<div style="background-color: rgba(234, 234, 234, 0.8);">';
            html += '<i class="fa fa fa-spinner fa-pulse center-block"> </i>';
            $(body).append('');
        },
        done: function (data) {
            alert("提交成功");
        },
        error: function (data) {
            $($.cherry.environ.dash).switch_page("#error-page", data.responseJSON);
        }
    };

    $.fn.switch_page = function (selector, context) {
        $.cherry.switch_page(selector, context, $(this));
    };

    $.cherry.setup = function (environ, state) {
        $.cherry.state = $.extend({}, $.cherry.default.state, state);
        $.cherry.environ = $.extend({}, $.cherry.default.environ, environ);

        /*
         Bind event to form.
         */
        $("body").on("submit", "form", function (event) {
            event.preventDefault();

            console.log(event);

            var form = $(this);
            console.log(form.data("submit"));
            if (form.data("submit") != undefined) {
                this.submit();
            } else {
                var action = form.attr("action");
                var method = form.attr("method");
                var enctype = form.attr("enctype");

                var button = $(this);
                var done = button.data("done");
                done = (done == undefined) ? "done" : done;
                var error = button.data("error");
                error = (error == undefined) ? "error" : error;

                var args = {
                    url: action,
                    type: method,
                    dataType: "JSON",
                    async: false,
                    headers: {
                        Authorization: $.sso.token
                    },
                    data: new FormData(this),
                    processData: false,  // tell jQuery not to process the data
                    contentType: false
                };

                //if (enctype != undefined) {
                //    args.enctype = enctype;
                //}

                $.ajax(args).done(
                    $.cherry.state[done]
                ).error(
                    state[error]
                );
            }
        });

        /*
         Bind event to state markup
         */
        $("body").on("click", "[data-state]", function () {
            var change_state = $(this).data("state");
            var context = $(this).data("context");
            set_state(change_state, context);
        });

        /*
         Bind event to pages markup
         */
        $("body").on("click", "[data-pages]", function () {
            var button = $(this);
            var context = $(button).data("context");
            switch_page(button.data("pages"), context);
        });
    };
})(jQuery);