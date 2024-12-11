/**
 * 获取 LCP（largest Contentful Paint）
 * 最大内容渲染，表示可视区“内容”最大的可见元素开始出现在屏幕上的时间点
 */
export const getLCP = () => {
    new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
        entryList.getEntries().map((metric) => {
            console.log('LCP', metric['startTime'])
        })
    }).observe({type: 'largest-contentful-paint', buffered: true});
}