/**
 * 等待页面激活
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Document/prerendering
 * @param callback
 */
export const whenActivated = (callback: () => void) => {
    // @ts-ignore
    if (document.prerendering) {
        addEventListener('prerenderingchange', () => callback(), true);
    } else {
        callback();
    }
};
