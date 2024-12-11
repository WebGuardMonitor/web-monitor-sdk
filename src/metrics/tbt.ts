export const getTBT = () => {
// 定义变量用于存储时间
    let totalBlockingTime = 0;
    let firstContentfulPaint = 0;

// 检查浏览器支持性
    if (PerformanceObserver && PerformanceObserver.supportedEntryTypes.includes("longtask") && PerformanceObserver.supportedEntryTypes.includes("paint")) {

        // 创建一个 PerformanceObserver 实例来监听长任务
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();

            entries.forEach((entry) => {
                // 确保长任务发生在 FCP 之后
                if (entry.startTime > firstContentfulPaint) {
                    const blockingTime = entry.duration - 50; // 计算阻塞时间（超过 50ms 的部分）
                    if (blockingTime > 0) {
                        totalBlockingTime += blockingTime; // 累加到总阻塞时间
                    }
                }
            });
        });

        // 监听长任务
        observer.observe({type: "longtask", buffered: true});

        // 获取 FCP 时间
        new PerformanceObserver((list, observer) => {
            const entries = list.getEntriesByName("first-contentful-paint");
            if (entries.length > 0) {
                firstContentfulPaint = entries[0].startTime;
                observer.disconnect(); // 获取到 FCP 后停止观察
            }
        }).observe({type: "paint", buffered: true});

        // 定期打印 TBT 值（仅用于调试，可以删除）
        setTimeout(() => {
            console.log(`TBT: ${totalBlockingTime.toFixed(2)} ms`);
        }, 1000);

    } else {
        console.warn("PerformanceObserver 或相关类型不受支持，无法计算 TBT。");
    }
}