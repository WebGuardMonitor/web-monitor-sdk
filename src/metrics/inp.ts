/**
 * 获取 INP（Interaction to Next Paint）
 * 响应速度，观察用户访问网页期间发生的所有点击、点按和键盘互动的延迟时间，评估网页对用户互动的总体响应情况
 */
export const getINP = () => {
    new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
        entryList.getEntries().forEach(entry => {
            console.log('entry', entry)
        })
    }).observe({type: 'event', buffered: true})
}