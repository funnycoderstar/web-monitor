function getPormanceMonitor() {
    var performance = window.performance;

    if (!performance) {
        // 当前浏览器不支持
        console.warn('你的浏览器不支持 performance 接口');
        return;
    }
    /** 根据 performance 获取一些数据*/
    const timing = window.performance.timing;
    const {
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        responseEnd,
        requestStart,
        domComplete,
        domInteractive,
        domContentLoadedEventEnd,
        loadEventEnd,
        responseStart,
        fetchStart,
    } = timing;

    // DNS解析，DNS查询耗时
    const dnsLinlkTime = domainLookupEnd - domainLookupStart;
    // TCP连接耗时
    const connectTime = connectEnd - connectStart;
    // TTFP: 首字节时间
    const ttfbTime = responseEnd - requestStart;
    // 响应读取时间
    const responseTime = responseEnd - responseStart;
    // DOM解析时间
    const domParseTime = domComplete - domInteractive;
    //
    const domContentLoadedTime = domContentLoadedEventEnd - fetchStart;
    console.log('domComplete', domComplete);
    // 首次可交互时间
    const domInteractiveTime = domInteractive - fetchStart;
    // 【重要】页面加载完成的时间
    // 【原因】几乎代表了用户等待页面可用的时间
    const loadTime = loadEventEnd - fetchStart;

    const performanceLog = {
        kind: 'experience',
        type: 'timing', // 统计每个阶段的时间
        dnsLinlkTime,
        connectTime,
        ttfbTime,
        responseTime,
        domParseTime,
        domContentLoadedTime,
        domInteractiveTime, // 首次可交互时间
        loadTime, // 完整的加载时间
    };
    console.log('performanceLog', performanceLog);

    // FP
    let FP = performance.getEntriesByName('first-paint')[0].startTime;

    // FCP
    let FCP = performance.getEntriesByName('first-contentful-paint')[0].startTime;
    // first-input 用户的第一次交互，点击页面或者输入值

    // LCP和FMP是通过 PerformanceObserver 来统计的，是异步的
    const otherPerformanceLog = {
        kind: 'experience',
        type: 'stageTiming', // 统计每个阶段的时间
        FP,
        FCP,
    };
    console.log('otherPerformanceLog', otherPerformanceLog);
}
window.onload = () => {
    setTimeout(() => {
        getPormanceMonitor();
    }, 1000);

    let FMP, LCP;
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        // entryList 观察的条目
        let perfEntries = entryList.getEntries();
        // FMP需要自己指定一个有意义的元素
        FMP = perfEntries[0];
        console.log('FMP', FMP);
        observer.disconnect();
    }).observe({ entryTypes: ['element'] }); // 观看页面中有意义的条目

    new PerformanceObserver((entryList, observer) => {
        // entryList 观察的条目
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        console.log('LCP', LCP);
        observer.disconnect();
    }).observe({ entryTypes: ['largest-contentful-paint'] }); // 观看页面中最大有意义的条目

    // FID
    new PerformanceObserver((entryList, observer) => {
        let firstInput = entryList.getEntries()[0];
        console.log('firstInput', firstInput);
        if (firstInput) {
            // processingStart 开始处理的时间，startTime开始点击的时间 差值就是处理的延迟
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            console.log(888888);
            let duration = firstInput?.duration; // 处理的耗时
            if (inputDelay > 0 || dutation > 0) {
                const performanceLog = {
                    kind: 'experience',
                    type: 'firstInputDelay', // 首次输入延迟
                    inputDelay,
                    duration,
                    startTime: firstInput.startTime,
                };
                console.log('FID', performanceLog);
            }
        }
        observer.disconnect();
    }).observe({ type: 'first-input', buffered: true });
};

// window.onload = () => {
//     getPormanceMonitor();
// };
// setTimeout(() => {
//     getPormanceMonitor();
// }, 0)
/**
 * 问题记录， 运行得到结果有一些值居然负数，出现这种情况主要是因为整个网页没有加载完成的情况下就调用了这方法
 * 1. 如果不放在 serTimeout里的话  performance.timing.domContentLoadedEventEnd 获取为0
 * 2. 如果不给 setTimeout 设置时间为 0的话， performance.timing.domInteractive 获取为0
 * 3. 使用 window.onload 时，获取到的 loadEventEnd 为 0， 是因为执行load事还是处于onload阶段，performance.timing.loadEventEnd 为0
 */
// 为了解决以上问题，可以通过下面的方式进行上报
// function domReady() {
//     let timer = null;
//     let runCheck = () => {
//         if (performance.timing.domComplete) {
//             clearTimeout(timer);
//             getPormanceMonitor();
//         } else {
//             timer = setTimeout(runCheck, 100);
//         }
//     };
//     window.addEventListener('DOMContentLoaded', runCheck, false);
// }

// domReady();
