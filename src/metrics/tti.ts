import ttiPolyfill from 'tti-polyfill';

// https://github.com/artsy/force/blob/main/src/Server/userPerformanceMetrics.ts#L88
async function tti() {
    const mertrics = Math.round(await ttiPolyfill.getFirstConsistentlyInteractive());
    console.log('tti', mertrics)
    return mertrics
}

export const getTTi = async () => {
//     // Helper function to check if the page is interactive.
//     function isPageInteractive(performanceEntries: any[]) {
//         // Check that all important resources have been loaded and no long tasks are running.
//         return performanceEntries.every(entry => entry.entryType !== 'longtask');
//     }
//
// // Function to estimate TTI.
//     function estimateTTI() {
//         let ttiTime: number | null = null;
//
//         const observer = new PerformanceObserver((list) => {
//             const entries = list.getEntries();
//             for (const entry of entries) {
//                 if (entry.entryType === 'longtask') {
//                     // If there's a long task after we thought the page was interactive,
//                     // reset the ttiTime because the page isn't really interactive yet.
//                     if (ttiTime && entry.startTime < ttiTime) {
//                         ttiTime = null;
//                     }
//                 } else if (!ttiTime && isPageInteractive(entries)) {
//                     // If the page looks interactive, set the TTI time.
//                     ttiTime = entry.startTime;
//                     console.log('Estimated TTI:', ttiTime);
//                 }
//             }
//         });
//
//         // Observe both long tasks and other relevant performance entries.
//         observer.observe({ entryTypes: ['longtask', 'mark'] });
//
//         // Start observing when the document becomes fully loaded.
//         window.addEventListener('load', () => {
//             // Create a mark to indicate the load event has fired.
//             performance.mark('window-load');
//         });
//     }

    // estimateTTI();

    await tti()
}
