(() => {
    const originAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        // 捕获添加事件时的堆栈
        const addStack = new Error(`Event (${type})`).stack;
        const wrappedListener = function (...args) {
            try {
                return listener.apply(this, args);
            } catch (err) {
                // 异常发生时，扩展堆栈
                err.stack += '\n' + addStack;
                console.log('inject-event-target', err);
                throw err;
            }
        };
        return originAddEventListener.call(this, type, wrappedListener, options);
    };
})();
