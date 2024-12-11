import {getFP} from "./fp";
import {getFCP} from "./fcp";
import {getLCP} from "./lcp";
import {onLoaded} from "../utils/helps";
import {getFID} from "./fid";
import {getCLS} from "./cls";
import {getTTFB} from "./ttfb";
import {getDCL} from "./dcl";
import {getFMP} from "./fmp";
import {getL} from "./l";
import {getFPS} from "./fps";
import {getTBT} from "./tbt";
import {getTTi} from "./tti";
import {getSI} from "./si";

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

export const initMetrics = () => {
    // new Metrics()
    console.log('页面当前状态', document.readyState)
    // 获取 LCP
    getLCP();
    // 获取 CLS
    getCLS();
    // 获取 DCL
    getDCL();

    // 页面全部加载完毕后才能执行
    onLoaded(() => {
        // 获取 FP
        getFP();
        // 获取 FCP
        getFCP();
        // 获取 FID
        getFID();
        // 获取 TTFB
        getTTFB();
        // 获取 FMP
        getFMP();
        // 获取 L
        getL();
    })

    // 获取 SI
    getSI();
    // 获取 TTi
    getTTi().then(r => console.log(r))

    // 获取 TBT
    getTBT()
    // 获取 FPS
    getFPS()
    // let lastTime = 0;
    // const measure = () => {
    //     console.log(`${Date.now() - lastTime}ms`);
    //     lastTime = Date.now();
    //     requestAnimationFrame(measure);
    // };
    // measure();

    // 获取 INP · 待定研究开发
    // onINP((metric)=>{
    //     console.log(metric)
    // })
}