export const getFMP = () => {
    // Get all paint timing entries
    const paintEntries = performance.getEntriesByType('paint');

    // Get FCP (First Contentful Paint)
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (!fcpEntry) {
        console.warn("No FCP timing available.");
        return null;
    }
    const fcpTime = fcpEntry.startTime;

    // Monitor layout and rendering changes after FCP to approximate FMP
    let largestArea = 0;
    let fmpTime = fcpTime;

    // Use MutationObserver to track layout changes
    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const visibleArea = Math.max(0, rect.width * rect.height);

            // Track the element with the largest visible area
            if (visibleArea > largestArea) {
                largestArea = visibleArea;

                // Update FMP time approximation
                fmpTime = performance.now();
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
    });

    observer.disconnect();

    console.log('FMP', fmpTime)
}