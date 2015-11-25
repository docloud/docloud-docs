/**
 * Created by yufeili on 15/11/25.
 */

var Handlebars = require("handlebars");

(function ($) {
    var compile_template = function (selector, context) {
        context._environ = $.cherry.environ;
        var source = $(selector).html();
        var template = Handlebars.compile(source);
        return template(context);
    };

    var switch_page = function (selector, container, context) {
        var html = compile_template(selector, $.extend({}, context));
        container = (container == undefined) ? $.cherry.environ.dash : container;
        $(container).fadeOut("fast").html(html).fadeIn("fast");
    };

    var set_state = function (state, context) {
        if (context == undefined) {
            $.cherry.state[state]();
        } else {
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
        done: function(data) {
            alert("提交成功");
        },
        error: function (data) {
            $($.cherry.environ.dash).switch_page("#error-page", data.responseJSON);
        }
    };

    $.fn.switch_page = function (selector, context) {
        $.cherry.switch_page(selector, $(this), context);
    };

    $.cherry.setup = function (environ, state) {
        $.cherry.state = $.extend({}, $.cherry.default.state, state);
        $.cherry.environ = $.extend({}, $.cherry.default.environ, environ);

        /*
         Bind event to form.
         */
        $("body").on("click", "[type=submit]", function () {
            var form = $(this).parents("form");
            var action = form.attr("action");
            var method = form.attr("method");

            var button = $(this);
            var done = button.data("done");
            done = (done == undefined) ? "done" : done;
            var error = button.data("error");
            error = (error == undefined) ? "error" : error;

            $.ajax({
                url: action,
                type: method,
                async: false,
                data: form.serialize()
            }).done(
                state[done]
            ).error(
                state[error]
            );
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