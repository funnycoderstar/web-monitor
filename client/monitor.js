window.addEventListener(
    'error',
    (event) => {
        const typeName = event.target.localName;
        if (typeName) {
            console.log('静态资源加载错误', typeName, event);
            const log = {
                kind: 'stability',
                type: 'error',
                errType: 'ResourceError',
                url: typeName === 'link' ? event.target.href : event.target.src,
                // message: event.message, // 报错信息
                // filename: event.filename,
                // position: `${event.lineno}: ${event.colno}`,
                // stack: event.error.stack,
                // selector: '', // 代表最后一个操作元素
            };
            console.log(`静态资源${typeName}加载错误日志`, log);
        } else {
            const log = {
                kind: 'stability',
                type: 'error',
                errType: 'jsError',
                url: '',
                message: event.message, // 报错信息
                filename: event.filename,
                position: `${event.lineno}: ${event.colno}`,
                stack: event.error.stack,
                selector: '', // 代表最后一个操作元素
            };
            console.log('JS运行错误日志', log);
        }
    },
    // 第三个参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。
    // 这个参数必须设置为 true 才能捕获到 静态资源报错，因为网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行
    true
);

window.addEventListener('unhandledrejection', (event) => {
    console.log('Promise错误', event);
    const log = {
        kind: 'stability',
        type: 'error',
        errType: 'promiseError',
        url: '',
        message: event.reason, // 报错信息
        // filename: event.filename,
        // position: `${event.lineno}: ${event.colno}`,
        // stack: event.error.stack,
        // selector: '', // 代表最后一个操作元素
    };
    console.log('Promise错误日志', log);
});

function reportAjaxError(event) {
    console.log('ajax接口请求错误', event);
}

// 覆写XMLHttpRequest API
function replaceAjax() {
    if (!window.XMLHttpRequest) return;
    var xmlhttp = window.XMLHttpRequest;
    var _oldSend = xmlhttp.prototype.send;
    var _handleEvent = function (event) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
            reportAjaxError(event);
        }
    };
    xmlhttp.prototype.send = function () {
        if (this['addEventListener']) {
            this['addEventListener']('error', _handleEvent);
            this['addEventListener']('load', _handleEvent);
            this['addEventListener']('abort', _handleEvent);
            this['addEventListener']('close', _handleEvent);
        } else {
            var _oldStateChange = this['onreadystatechange'];
            this['onreadystatechange'] = function (event) {
                if (this.readyState === 4) {
                    _handleEvent(event);
                }
                _oldStateChange && _oldStateChange.apply(this, arguments);
            };
        }
        return _oldSend.apply(this, arguments);
    };
}
replaceAjax();

function reportFetchError(event) {
    console.log('fetch接口请求错误', event);
}

// 覆写fetch API
function replaceFetch() {
    if (!window.fetch) return;
    const originFetch = window.fetch;
    window.fetch = function () {
        return originFetch
            .apply(this, arguments)
            .then(function (res) {
                if (!res.ok) {
                    // True if status is HTTP 2xx
                    reportFetchError(res);
                }
                return res;
            })
            .catch(function (error) {
                reportFetchError(error);
            });
    };
}
replaceFetch();
