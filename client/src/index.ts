import errorMonitor from './errorMonitor';
import getPermanceMonitor from './performanceMonitor';
/**
 * Tracker 配置参数
 */
interface TrackerOptions {
    /** 应用id */
    id: string;
}

class MonitorTracker {
    /** 配置参数 */
    private options: TrackerOptions;

    constructor(options: TrackerOptions) {
        this.options = options;
    }
    init() {
        window.addEventListener('load', () => {
            errorMonitor();
            getPermanceMonitor();
        });
    }
    /**
     * 获取公共信息
     */
    getCommon() {
        const { innerWidth: width, innerHeight: height, location, document, navigator } = window;
        const { href: url } = location;
        const { title, referrer } = document;
        let net = '';
        // @ts-ignore
        if (navigator.connection && navigator.connection.effectiveType) {
            // @ts-ignore
            net = navigator.connection.effectiveType;
        }

        // url, ua, ip 解析在服务端做
        return {
            id: this.options.id,
            timestamp: Date.now(),
            url,
            title,
            referrer,
            ua: navigator.userAgent,
            net,
            width,
            height,
            // sdkVer: version,
            userId: '',
            assetsVer: '',
            sendMode: '',
        };
    }
}

export default MonitorTracker;
