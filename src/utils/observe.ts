import {LayoutShift} from "../types";

interface PerformanceLongAnimationFrameTiming extends PerformanceEntry {
    renderStart: DOMHighResTimeStamp;
    duration: DOMHighResTimeStamp;
}

interface PerformanceEntryMap {
    'event': PerformanceEventTiming[];
    'first-input': PerformanceEventTiming[];
    'layout-shift': LayoutShift[];
    'largest-contentful-paint': LargestContentfulPaint[];
    'long-animation-frame': PerformanceLongAnimationFrameTiming[];
    'paint': PerformancePaintTiming[];
    'navigation': PerformanceNavigationTiming[];
    'resource': PerformanceResourceTiming[];
}


export const observe = (type: PerformanceEntryMap) => {
    console.log(type)
}