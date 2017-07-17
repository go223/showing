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
};

YB.browser = {
    versions: function () {
        var u = navigator.userAgent,app = navigator.appVersion;
        //移动终端浏览器版本信息
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: (!!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/)) && u.indexOf('Windows NT') < 0, //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1,// || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        }
    },
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}

var validator = {
    userName: function (value) {
        //4到16位，数字下划线，减号
        var reg = /^[a-zA-Z0-9_-]{4,16}$/;
        return reg.test(value);
    },
    password: function (value) {
        //最少六位，包括一个大写字母，一个小写字母，一个数字一个特殊字符
        var reg = /^.*(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
        return reg.test(value);
    },
    numInt: function (value) {
        var reg = /^-?\d+$/;
        return reg.test(value);
    },
    num: function (value) {
        var reg = /^-?\d*\.?\d+$/;
        return reg.test(value);
    },
    email: function (value) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(value);
    },
    phone: function (value) {
        var reg = /^1[34578]\d{9}$/;
        return reg.test(value);
    },
    url: function (value) {
        var reg = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return reg.test(value);
    },
    ipv4: function (value) {
        var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return reg.test(value);
    },
    rgb: function (value) {
        var reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        return reg.test(value);
    },
    date: function (value) {
        //2017-01-02
        var reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
        return reg.test(value);
    },
    qq: function (value) {
        var reg = /^[1-9][0-9]{4,10}$/;
        return reg.test(value);
    },
    wx: function (value) {
        //字母开头，字母，谁，减号，下划线。6到20位，
        var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
        return reg.test(value);
    },
    carNum: function (value) {
        //车牌号
        var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        return reg.test(value);
    },
    chinese: function (value) {
        var reg = /[\u4E00-\u9FA5]/;
        return reg.test(value);
    }
}
var consolelogurl = YB.basePath + 'images/logo.jpg'
console.log("%c          ","font-size:80px;background:url('"+consolelogurl+"') no-repeat 100px 10px");
var menu = {
    initEvent: function () {
        $('#menu_button').bind('click',function () {
            $('.yb-nav-list').toggleClass('on');
        });
    },
    initNavMouseEvent: function () {
        $('.yb-nav-list-item').unbind('click');
        $('.yb-nav-list-item').mouseenter(function() {
            $(this).find('.yb-nav-list-item-nav2').addClass('on');
        });
        $('.yb-nav-list-item').mouseleave(function () {
            $(this).find('.yb-nav-list-item-nav2').removeClass('on');
        });
    },
    initNavClickEvent: function () {
        $('.yb-nav-list-item').unbind('mouseenter');
        $('.yb-nav-list-item').unbind('mouseleave');
        $('.yb-nav-list-item').on('click',function (e) {
            e.stopPropagation();
            if ($(this).find('.yb-nav-list-item-nav2').hasClass('on')) {
                $(this).find('.yb-nav-list-item-nav2').removeClass('on');
            } else {
                $(this).find('.yb-nav-list-item-nav2').addClass('on');
            }
        })
    },
    mbMenu: function () {
        var _self = this;
        var cWidth = $(window).width();
        console.log(cWidth);
        if (cWidth > 798) {
            _self.initNavMouseEvent();
        } else {
            _self.initNavClickEvent();
        }
    }
}
$(function () {
    menu.mbMenu();
    menu.initEvent();
    $(window).resize(function () {
        menu.mbMenu();
    })
})

