export enum readyStateEnum {
    COMPLETE = 'complete'
}


export const supportedEntryTypes: string[] = [
    'element',
    'event',
    'first-input',
    'largest-contentful-paint',
    'layout-shift',
    'long-animation-frame',
    'longtask',
    'mark',
    'measure',
    'navigation',
    'paint',
    'resource',
    'visibility-state'
];


export interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}