/**
 * 获取 LCP（largest Contentful Paint）
 * 最大内容渲染，表示可视区“内容”最大的可见元素开始出现在屏幕上的时间点
 */
export const getLCP = () => {
    const [entry] = performance.getEntriesByName('largest-contentful-paint')
    console.log('LCP:', entry ? entry['startTime'] : 0)
}