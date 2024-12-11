/**
 * 获取 FID（First Input Delay）
 * FID 是用户首次与页面进行交互所花费的时间，它包括用户在页面上首次点击、触摸、滚动或按回车键等操作所花费的时间。
 * 首次输入延迟，用户首次和页面交互（单击链接、点击按钮等）到页面响应交互的时间
 */
export const getFID = (): void => {
    new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
        const entries: PerformanceEntryList = entryList.getEntries();
        if (entries.length === 0) return;

        const entry: PerformanceEventTiming = entries[0] as PerformanceEventTiming;

        // 计算延迟时间
        const delay: number = entry.processingStart - entry.startTime;
        console.log('FID:', delay);
    }).observe({type: 'first-input', buffered: true});
}