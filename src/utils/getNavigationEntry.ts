// @ts-ignore
/**
 * 获取页面导航的性能计时信息。
 *
 * 这个函数尝试获取 PerformanceNavigationTiming 对象，该对象包含了
 * 有关页面加载和导航过程的详细计时信息。
 *
 * @returns {PerformanceNavigationTiming} 返回导航性能计时对象，
 *          如果无法获取有效的导航条目则返回 void。
 */
// @ts-ignore
export const getNavigationEntry = (): PerformanceNavigationTiming => {
    // 尝试获取导航性能条目
    // @ts-ignore 使用 @ts-ignore 来避免 TypeScript 对 self.performance 可能不存在的警告
    const navigationEntry: PerformanceNavigationTiming =
        self.performance &&
        performance.getEntriesByType &&
        performance.getEntriesByType('navigation')[0];

    // 验证导航条目的有效性
    // 检查确保 `responseStart` 属性存在且有效
    // 在某些情况下，浏览器不会报告该值（出于隐私/安全原因），
    // 在其他情况下（bug），该值可能为负数或大于当前页面时间
    // 我们会忽略这些无效的情况
    // 相关问题：
    // https://github.com/GoogleChrome/web-vitals/issues/137
    // https://github.com/GoogleChrome/web-vitals/issues/162
    // https://github.com/GoogleChrome/web-vitals/issues/275
    if (
        navigationEntry &&                                    // 确保导航条目存在
        navigationEntry.responseStart > 0 &&                  // 确保响应开始时间是正数
        navigationEntry.responseStart < performance.now()     // 确保响应开始时间不晚于当前时间
    ) {
        return navigationEntry;
    }
}

