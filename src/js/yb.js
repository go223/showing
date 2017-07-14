/* yb  framework */
;if (!window['YB']) {
    window['YB'] = {};
}
YB.contextPath = '';

/* 
-----------------------------------------log
*/
YB.Log = function () {};
YB.Log.prototype.info = function (msg) {
    var time = new Date().toTimeString();
    console.info(time + "::: "+ msg);
};

var _log = new YB.Log();
YB.log = function (msg) {
    _log.info(msg);
};

/* 
-----------------------------------------basepath
*/
YB._getBasePath = function () {
    var result = "";
    var scripts = document.getElementsByTagName("script");
    var reg = /yb([.-]\d)*\.js(\W|$)/ig;
    for (var i = 0,len = scripts.length; i < len; i++) {
        var src = !!document.querySelector ? scripts[i].src : srcripts[i].getAttribute("src",4);
        if (src && reg.test(src)) {
            result = src;
            break;
        }
    }
    return result.substr(0,result.lastIndexOf("js/"));
};
YB.basePath = YB._getBasePath();

/* 
-----------------------------------------MessageBus
*/
YB.MessageBus = {
    query:{},
    publish: function (subject) {
        var eventId = subject.eventId;
        var data = (subject.data == null || subject.data == undefined) ? {} : subject.data;
        this.query[eventId] = this.query[eventId] || [];
        var subscribers = this.query[eventId];
        var length = subscribers.length;
        console.log("%c publish---messagebus","color:red");
        YB.log("MessageBus publish:" + subject.eventId + "  callbacks" + length);
        for (var i in subscribers) {
            var context = subscribers[i].context;
            var handler = subscribers[i].handler;
            if (context) {
                handler && handler.call(context,data);
            } else {
                handler && handler(data);
            }
        }
        
    },
    subscribe: function (eventId,handler,context) {
        console.log("%c subscribe---messagebus","color:red");
        YB.log("MessageBus subscribe:" + eventId);
        this.query[eventId] = this.query[eventId] || [];
        this.query[eventId].push({
            context:context,
            handler:handler
        })
    },
    unSubscribe: function (eventId,fn) {
        var subscribers = this.query[eventId];
        if (!!subscribers) {
            for (var i = 0,l = subscribers.length; i < l; i++) {
                var handler = subscribers[i].handler;
                if (fn == handler) {
                    subscribers[i].handler = null;
                    break;
                }
            }
        }
    }
}

YB.Util = {
    clone: function (o) {
        var self = this;
        var objClone;
        if (o.constructor == Object || o.constructor == Array) {
            objClone = new o.constructor();
        } else {
            objClone = new o.constructor(o.valueOf());
        };
        for (var key in o) {
            if (objClone[key] != o[key]) {
                if (typeof(o[key]) == 'object') {
                    objClone[key] = self.clone(o[key]);
                } else {
                    objClone[key] = o[key];
                }
            }
        }
    },
    formatDate: function (date,boolean) {
        /* formater@parse  YYYY-MM-DD hh:mm:ss */
        var formater = "YYYY-MM-DD hh:mm:ss";
        var time = date.replace(/-/g,"/");
        var newDate = new Date(time);
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = newDate.getDate();
        day = day < 10 ? "0" + day : day;
        var hour = newDate.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        var minute = newDate.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        var second = newDate.getSeconds();
        second = second < 10 ? "0" + second : second;
        var _after = year + '-' + month + '-' + day;
        if (!!boolean) {
            _after = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }
        return _after;
    },
    $commafy: function (num) {
        if (num != undefined) {
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
        } else {
            return '';
        }
    },
    $commafyback: function (str) {
        if (!!str) {
            str = (str + '').replace(/,/g,'');
            var fraction_part = str.split('.')[1];
            var length = 0;
            if (!!fraction_part) {
                length = fraction_part.length;
            }
            return parseFloat(str).toFixed(length);
        } else {
            return 0;
        }
    },
    add: function (arg1,arg2) {
        if (!!!arg1 || !!!arg2) {
            return "";
        };
        var r1,r2,m;
        try{
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        };
        try{
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        };
        m = Math.pow(10,Math.max(r1,r2));
        return (arg1*m + arg2*m)/m;
    },
    sub: function (arg1,arg2) {
        if (!!!arg1 || !!!arg2) {
            return "";
        }
        var r1,r2,m,n;
        try{
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try{
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10,Math.max(r1,r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1*m - arg2*m)/m).toFixed(n);
    },
    mul: function (arg1,arg2) {
        if (!!!arg1 || !!!arg2) {
            return "";
        };
        var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
        try{
            m += s1.split(".")[1].length;
        } catch (e) {

        }
        try{
            m += s2.split(".")[1].length;
        } catch (e) {

        }
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    },
    div:function (arg1,arg2) {
        if (!!!arg1 || !!!arg2) {
            return "";
        };
        var t1 = 0,
        t2 = 0,
        r1,
        r2;
        try{
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {

        }
        try{
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {

        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".",""));
            r2 = Number(arg2.toString().replace(".",""));
            return (r1/r2)*pow(10,t2 - t1);
        }
    }
}

/* 菜单切换 */
YB.menu = {
    mbMenu: function () {
        $('#menu_button').on('click',function () {
            $('.yb-nav-list').toggleClass('on');
        });
    }
}
$(function () {
    YB.menu.mbMenu();
})

