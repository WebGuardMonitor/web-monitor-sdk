import {readyStateEnum} from "../types";

export type InternalGlobal = {
    navigator?: { userAgent?: string };
    console: Console;
    PerformanceObserver?: any;
};

export const GLOBAL_OBJ = globalThis as unknown as InternalGlobal;

export const WINDOW = GLOBAL_OBJ as typeof GLOBAL_OBJ & Window;

/**
 * 监听页面加载完成
 * @param callback
 */
export const onLoaded = (callback: () => void) => {
    document.addEventListener('readystatechange', () => {
        if (document.readyState === readyStateEnum.COMPLETE) {
            callback()
        }
    })
}