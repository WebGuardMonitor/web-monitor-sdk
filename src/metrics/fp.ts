/**
 * 获取 FP（First Paint）
 * 首次绘制，标记浏览器渲染任何在视觉上不同于导航前屏幕内容的时间点
 */
export const getFP = () => {
    const [entry] = performance.getEntriesByName('first-paint')
    console.log('FP:', entry?.['startTime'])
}