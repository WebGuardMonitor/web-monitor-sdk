import {initMetrics} from "./metrics";

export const InitMonitor = () => {
    console.log('开始监控了')
    // 开始性能指标数据
    initMetrics()
}