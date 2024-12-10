/**
 * 获取 FCP（First Contentful Paint）
 * 首次内容绘制，标记浏览器渲染来自Dom 第一内容的时间点，该内容可能是文本、图像、SVG甚至是元素
 */
export const getFCP = () => {
    const [entry] = performance.getEntriesByName('first-contentful-paint')
    console.log('FCP:', entry?.['startTime'])
}