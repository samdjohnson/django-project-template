/* csrf dealios */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

/************************************************
*
* Jquery Plugin to better serialize form data
* into a dictionary.
*
* Usage:
*
* HTML: 
*
* <form id="basic-form">
*   <input type="text" name="name" placeholder="Your Name"/>
*   <input type="text" name="email" placeholder="you@email.com"/>
* </form>
*
* JS:
*
* $("#basic-form").serializeForm() -> { "name": "<name>", "email": "<email>" }
*
************************************************/

(function( $ ){
    $.fn.serializeForm = function( options ){
        var arr = $(this).serializeArray( options );
        var d = {};
        var counter = {};
        for( var i in arr ){
            var name = arr[i]['name'];
            var value = arr[i]['value'];

            // handle multiple keys with the same name
            if( counter[name] ){
                name = name + "_" + ( counter[name]++ );
            } else {
                counter[name] = 1;
            }
            d[name] = value;
        }
        return d;
    }
})( jQuery );

/******************************************
*
*
* Ajax Inline Updating
*
* Requires Bootstrap
* 
* Usage:
* 
* <input type="text impressions" data-ajax-inline='true'>
*
*
* $(".impresions").ajaxInline({
*   "url": "/adproducts/product-members/",
*   "dataId": "data-product-member-id", (optional)
*   "attr": "impressions", (optional),
*   "scrub": function() (optional)
* })
*
*
*******************************************/

(function( $ ){
    var Lock = (function(){
        var keys = {};

        function lock( key ){
            keys[key] = "locked";
        }

        function unlock( key ){
            delete keys[key];
        }

        function islocked( key ){
            return keys[key] && ( keys[key] === "locked" );
        }

        var exports = {};
        exports.lock = lock;
        exports.unlock = unlock;
        exports.islocked = islocked;
        return exports;
    })();

    $.fn.ajaxInline = function( options ){
        var selector = this.selector;

        var settings = $.extend({
            "url": "",
            "dataId": "data-id",
            "attr": selector.replace(/(\.|#)/g, ''),
            "scrub": function(val){ return val; },
            "format": function(val){ return val; }
        }, options);

        $(document).on("keypress", selector, function( e ){
            if( e.keyCode === 13 ) $(this).focusout();
        });

        $(document).on("keyup", selector, function( e ){
            var id = getId( this );
            if( e.keyCode !== 13 ) Lock.lock( selector + id );
        });

        $(document).on("focusout", selector, function(){
            var self = this;
            var id = getId( this );
            var newVal = settings.scrub( $(this).val() );

            if( !Lock.islocked( selector + id ) ) return; 

            var postData = {};
            postData[settings.attr] = newVal;

            $.ajax({
                "url": settings.url + id,
                "data": postData,
                "type": "POST",
                "success": function( data ) {
                    if( data.error ) return error( self );
                    Lock.unlock( selector + id );
                    success( self );
                    $(self).val( settings.format( newVal ) );
                },
                "error": function( data ) {
                    error( self );
                }
            });
        });

        function success( self ){
            setStatus( self, "<span class='badge badge-success'>Saved!</span>" );
        }

        function error( self ){
            setStatus( self, "<span class='badge badge-important'>Something went wrong</span>" );
        }

        function setStatus( self, message ){
            var container = getContainer( self );
            var status = container.find(".status");
            if( status.length === 0 ) return;

            status.html( message );
            setTimeout(function(){
                status.html("");
            }, 3000)
        };


        function getId( self ){
            return getContainer( self ).attr( settings.dataId );
        } 

        function getContainer( self ){
            return $(self).closest( "[" + settings.dataId + "]" );
        }
    }
})( jQuery );
    