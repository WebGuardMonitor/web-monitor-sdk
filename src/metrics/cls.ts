import {LayoutShift} from "../types";


interface CLSState {
    value: number;
    entries: LayoutShift[];
}

const initialState: CLSState = {
    value: 0,
    entries: [],
};

let clsState: CLSState = {...initialState};
let sessionState: CLSState = {...initialState};


/**
 * 获取 CLS（Cumulative Layout Shift）
 * 布局偏移总数，用于衡量在网页的整个生命周期内发生的每一次意外布局偏移的布局偏移得分的最高累计分数
 * @link https://github.com/getsentry/sentry-javascript/blob/develop/packages/browser-utils/src/metrics/web-vitals/getCLS.ts
 */
// export const getCLS = () => {
//     new PerformanceObserver((list: PerformanceObserverEntryList) => {
//         // @ts-ignore
//         list.getEntries().map((entry: LayoutShift) => {
//
//             // 若是用户自己操作改变的布局则不计入统计
//             if (!entry.hadRecentInput) {
//
//                 // console.log('entry', entry, entry.hadRecentInput)
//
//                 const firstSessionEntry = sessionEntries[0];
//                 const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
//
//                 // 如果条目与上一条目的相隔时间小于 1 秒且
//                 // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
//                 // 包含在当前会话中。否则，开始一个新会话。
//
//                 if (
//                     sessionValue &&
//                     entry.startTime - lastSessionEntry.startTime < 1000 &&
//                     entry.startTime - firstSessionEntry.startTime < 5000
//                 ) {
//                     sessionValue += entry.value;
//                     sessionEntries.push(entry);
//                 } else {
//                     sessionValue = entry.value;
//                     sessionEntries = [entry];
//                 }
//
//
//                 // 如果当前会话值大于当前 CLS 值，
//                 // 那么更新 CLS 及其相关条目。
//                 if (sessionValue > clsValue) {
//                     clsValue = sessionValue;
//                     clsEntries = sessionEntries;
//
//                     console.log('clsValue', clsValue, clsEntries)
//                 }
//             }
//
//         })
//
//     }).observe({type: 'layout-shift', buffered: true})
// }

export const getCLS = () => {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (isLayoutShift(entry) && !entry.hadRecentInput) {
                updateSessionState(entry);

                // 如果当前会话值大于当前 CLS 值，更新 CLS 及其相关条目。
                if (sessionState.value > clsState.value) {
                    clsState = {...sessionState};
                    console.log('Updated CLS:', clsState);
                }
            }
        }
    });

    observer.observe({type: 'layout-shift', buffered: true});
};

/**
 * 判断是否为 LayoutShift 类型
 * @param entry
 */
function isLayoutShift(entry: PerformanceEntry): entry is LayoutShift {
    return entry.entryType === 'layout-shift';
}


/**
 * 更新会话状态
 * @param entry
 */
function updateSessionState(entry: LayoutShift) {
    const {startTime} = entry;
    const lastEntry = sessionState.entries[sessionState.entries.length - 1];
    const firstEntry = sessionState.entries[0];

    // 如果条目与上一条目的相隔时间小于 1 秒且
    // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目包含在当前会话中。
    // 否则，开始一个新会话。
    if (
        !lastEntry ||
        (startTime - lastEntry.startTime < 1000 &&
            startTime - firstEntry.startTime < 5000)
    ) {
        sessionState.value += entry.value;
        sessionState.entries.push(entry);
    } else {
        sessionState = {
            value: entry.value,
            entries: [entry],
        };
    }
}

// 提供一个方法来重置状态，以便可以在需要时重新开始计算
export const resetCLS = () => {
    clsState = {...initialState};
    sessionState = {...initialState};
};