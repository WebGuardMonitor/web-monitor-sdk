import {getNavigationEntry} from "../utils/getNavigationEntry";

let metric: number = 0;

/**
 * 获取 TTFB（Time to First Byte）
 * 首字节时间，衡量网络使用资源的第一个字节响应用户请求所需的时间
 */
export const getTTFB = () => {

    const navigation = getNavigationEntry();
    metric = navigation.responseStart - navigation.requestStart
    console.log('TTFB', metric);
    // if (navigation.responseStart !== undefined && navigation.activationStart !== undefined) {
    //     metric = navigation.responseStart - navigation.activationStart;
    // } else {
    //     console.log("无法计算 TTFB，因为 responseStart 或 activationStart 为 undefined");
    // }
}

export const getTTFBMetric = () => metric;