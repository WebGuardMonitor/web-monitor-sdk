import {getNavigationEntry} from "../utils/getNavigationEntry";

let metric: number = 0;

/**
 * 获取 DCL（Dom Content Loaded）
 * 当 HTML 文档被完全加载和解析完成之后，DomContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载
 */
export const getDCL = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const navigation = getNavigationEntry();
        setTimeout(() => {
            // 获取导航开始时间
            const navigationStart = navigation.domContentLoadedEventStart;
            // 获取DOMContentLoaded事件时间
            const domContentLoadedTime = navigation.domContentLoadedEventEnd;

            // 计算DCL时间（毫秒）
            metric = domContentLoadedTime - navigationStart;

            console.log(`DCL: ${metric}`);
        }, 0);

    });
}