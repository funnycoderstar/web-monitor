window.addEventListener(
    'error',
    (event) => {
        console.log('addEventListener error', event);
        const typeName = event.target.localName;

        const target = event.target || event.srcElement;
        const isElementTarget =
            target instanceof HTMLScriptElement ||
            target instanceof HTMLLinkElement ||
            target instanceof HTMLImageElement;
        if (isElementTarget) {
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
                stack: event?.error?.stack,
                selector: '', // 代表最后一个操作元素
            };
            console.log('JS运行错误日志', log);
        }
    },
    // 第三个参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。
    // 这个参数必须设置为 true 才能捕获到 静态资源报错，因为网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行
    true
);

// unhandledrejection如果去掉控制台的异常显示，需要加上`e.preventDefault();  虽然可以使用增加unhandledrejection 的监听来捕获promise的异常处理，但处理fetch或者ajax的异常捕获，还是不太适合，因为他只能捕获到这个错误，而无法获取错误出现的位置和错误详情；`
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
    let log;
    if (event?.currentTarget?.response) {
        log = {
            kind: 'stability',
            type: 'error',
            errType: 'ajaxApiError',
            url: event.currentTarget.responseURL,
            status: event.currentTarget.status,
            message: event?.currentTarget?.response?.msg, // 报错信息
            result: event?.currentTarget?.response?.result,
        };
    } else {
        log = {
            kind: 'stability',
            type: 'error',
            errType: 'ajaxError',
            url: event.currentTarget.responseURL,
            status: event.currentTarget.status,
            message: event.currentTarget.statusText, // 报错信息
        };
    }

    console.log('ajax接口请求错误日志', log);
}

// 覆写XMLHttpRequest API
function replaceAjax() {
    if (!window.XMLHttpRequest) return;
    var xmlhttp = window.XMLHttpRequest;
    var _oldSend = xmlhttp.prototype.send;
    var _handleEvent = function (event) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
            reportAjaxError(event);
        } else {
            if (event?.response?.result !== 1) {
                reportAjaxError(event);
            }
        }
    };
    const _load = function (event) {
        console.log('执行ajax load 事件');
        _handleEvent(event);
    };
    const _error = function (event) {
        console.log('执行ajax error 事件');
        _handleEvent(event);
    };
    const _abort = function (event) {
        console.log('执行ajax abort 事件');
        _handleEvent(event);
    };
    const _close = function (event) {
        console.log('执行ajax close 事件');
        _handleEvent(event);
    };
    xmlhttp.prototype.send = function () {
        if (this['addEventListener']) {
            this['addEventListener']('error', _error);
            this['addEventListener']('load', _load);
            this['addEventListener']('abort', _abort);
            this['addEventListener']('close', _close);
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
    const log = {
        kind: 'stability',
        type: 'error',
        errType: 'fetchError',
        url: event.url,
        status: event.status,
        message: event.statusText, // 报错信息
    };
    console.log('fetch接口请求错误日志', log);
}

// function parseDataPlatform1({ type, response }) {
//     if (type === 'fetch') {
//         if (!response.ok) {
//             return {
//                 error: 1,
//             };
//         } else {
//             if (response.data.errCode !== 0) {
//                 return {
//                     error: 2,
//                 };
//             }
//         }
//         return {
//             error: 0,
//         };
//     } else if (type === 'ajax') {
//         // same as above
//     }
// }

// function parseDataPlatform2({ type, response }) {
//     if (type === 'fetch') {
//         if (!response.ok) {
//             return {
//                 error: 1,
//             };
//         } else {
//             if (response.data.error_code !== '0') {
//                 return {
//                     error: 2,
//                 };
//             }
//         }
//         return {
//             error: 0,
//         };
//     } else if (type === 'ajax') {
//         // same as above
//     }
// }

// 覆写fetch API
function replaceFetch() {
    if (!window.fetch) return;
    const _originFetch = window.fetch;
    window.fetch = function fetch() {
        return _originFetch
            .apply(this, arguments)
            .then(function (res) {
                const forkedRes = res.clone();
                if (!forkedRes.ok) {
                    // True if status is HTTP 2xx
                    reportFetchError(forkedRes);
                }

                // const error = parseData(forkedRes);

                return res;
            })
            .catch(function (error) {
                reportFetchError(error);
                throw error;
            });
    };
}
replaceFetch();
