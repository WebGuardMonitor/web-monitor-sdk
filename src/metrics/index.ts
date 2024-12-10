import {getFP} from "./fp";
import {getFCP} from "./fcp";
import {getLCP} from "./lcp";
import {onLoaded} from "../utils/helps";
import {getFID} from "./fid";
import {getCLS} from "./cls";

/**
 * 监控浏览器性能数据指标
 *
 * 此类涉及以下指标：
 * FP（First Paint）
 * FCP（First Contentful Paint）
 * FMP（First Meaningfull Paint）
 * LCP（largest Contentful Paint）
 * FID（First Input Delay）
 * SI（Speed Index）
 * CLS（Cumulative Layout Shift）
 * TTi（Time to Interactive）
 * TBT（Total Blocking Time）
 * TTFB（Time to First Byte）
 * FPS（Frames Per Second）
 * INP（Interaction to Next Paint）
 * DCL（Dom Content Loaded）
 * L（onLoad）
 */
// class Metrics {
//     constructor() {
//         console.log(document.readyState, WINDOW.performance)
//         // @link https://developer.mozilla.org/zh-CN/docs/Web/API/Document/readyState
//         // 监听页面是否全部加载完毕，非 interactive 状态
//         document.addEventListener('readystatechange', function () {
//             if (document.readyState === 'complete') {
//                 // 当文档和所有资源完全加载后执行的代码
//                 this.logPaintTimes()
//                 console.log('页面已全部加载完毕', WINDOW.performance.getEntriesByType('paint'))
//             }
//         });
//         // document.onreadystatechange = function () {
//         //     if (document.readyState === "interactive") {
//         //         initApplication();
//         //     }
//         // };
//         // 确保在页面加载完成后调用
//         PageLoaded(this.logPaintTimes);
//     }
//
//     logPaintTimes() {
//         const paintEntries = performance.getEntriesByType('paint');
//         if (paintEntries.length === 0) {
//             console.log('No paint entries available.');
//             return;
//         }
//
//         let firstPaintTime, firstContentfulPaintTime;
//
//         for (let entry of paintEntries) {
//             if (entry.name === 'first-paint' && firstPaintTime === undefined) {
//                 firstPaintTime = entry.startTime;
//             }
//             if (entry.name === 'first-contentful-paint' && firstContentfulPaintTime === undefined) {
//                 firstContentfulPaintTime = entry.startTime;
//             }
//         }
//
//         console.log(`First Paint: ${firstPaintTime}ms`);
//         console.log(`First Contentful Paint: ${firstContentfulPaintTime}ms`);
//     }
// }


export const initMetrics = () => {
    // new Metrics()

    console.log('页面当前状态', document.readyState)

    // 获取 LCP
    getLCP();

    // 页面全部加载完毕后才能执行
    onLoaded(() => {
        // 获取 FP
        getFP();
        // 获取 FCP
        getFCP();
        // 获取 FID
        getFID();
    })
    console.log('页面当前状态', document.readyState)

    // first-input
    // 获取 FMP

    // 获取 SI
    // 获取 CLS
    getCLS();

    // 获取 TTi
    // 获取 TBT
    // 获取 TTFB
    // 获取 FPS
    // 获取 INP
    // 获取 DCL
    // 获取 L
}