var Util;
(function (Util) {
    function map($arg, callbackfn) {
        return $arg.map(function () {
            return callbackfn(this);
        }).get();
    }
    Util.map = map;
    function tag(item, func) {
        var val = item.data('tag');
        if (val)
            return val;
        else {
            val = func();
            item.data('tag', val);
            return val;
        }
    }
    Util.tag = tag;
})(Util || (Util = {}));
//# sourceMappingURL=Util.js.map