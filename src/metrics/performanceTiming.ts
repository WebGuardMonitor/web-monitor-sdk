export const PerformanceTiming = performance.getEntriesByType('navigation').length > 0
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。