module Util {
    export function map<U>($arg: any, callbackfn: (value: any) => U): U[] {
        return $arg.map(function () {
            return callbackfn(this);
        }).get();
    }
    export function tag<T>(item: any, func: () => T): T {
        let val = item.data('tag');
        if (val)
            return val;
        else {
            val = func();
            item.data('tag', val);
            return val;
        }
    }
}