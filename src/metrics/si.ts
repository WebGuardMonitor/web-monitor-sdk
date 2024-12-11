export const getSI = () => {
    // Create a performance observer to track paint events
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntriesByType('paint');
        entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
                fcpTime = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
                lcpTime = entry.startTime;
            }
        });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

    let fcpTime = 0; // First Contentful Paint
    let lcpTime = 0; // Largest Contentful Paint
    let visualProgress = []; // Array to store timestamps and completion percentages

    // Track visual progress by periodically capturing the viewport state
    function trackVisualProgress() {
        const time = performance.now();
        const completion = calculateVisualCompletion(); // Calculate visible percentage of the viewport
        visualProgress.push({ time, completion });

        if (completion < 100) {
            requestAnimationFrame(trackVisualProgress);
        } else {
            finalizeSpeedIndex();
        }
    }

    // Simulate visual completion calculation (you would replace this with actual logic)
    function calculateVisualCompletion() {
        const body = document.body;
        const html = document.documentElement;
        const totalHeight = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        const viewportHeight = window.innerHeight;

        // Example: Completion ratio based on height (you can use other metrics)
        const visibleHeight = Math.min(totalHeight, viewportHeight);
        return (visibleHeight / totalHeight) * 100;
    }

    // Finalize Speed Index calculation using captured visual progress
    function finalizeSpeedIndex() {
        let speedIndex = 0;
        let lastTime = 0;
        let lastCompletion = 0;

        visualProgress.forEach(({ time, completion }) => {
            if (completion > lastCompletion) {
                speedIndex += (time - lastTime) * (1 - lastCompletion / 100);
                lastTime = time;
                lastCompletion = completion;
            }
        });

        console.log('Speed Index:', speedIndex);
    }

    // Start tracking visual progress
    trackVisualProgress();
}