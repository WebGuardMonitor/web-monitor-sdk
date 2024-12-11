/** Get's the global object for the current JavaScript runtime */
const GLOBAL_OBJ = globalThis ;

const WINDOW$1 = GLOBAL_OBJ

const generateUniqueID = () => {
    return `v4-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};

let firstHiddenTime = -1;
const initHiddenTime = () => {
    // If the document is hidden when this code runs, assume it was always
    // hidden and the page was loaded in the background, with the one exception
    // that visibility state is always 'hidden' during prerendering, so we have
    // to ignore that case until prerendering finishes (see: `prerenderingchange`
    // event logic below).
    return WINDOW$1.document.visibilityState === 'hidden' && !WINDOW$1.document.prerendering ? 0 : Infinity;
};

const onVisibilityUpdate = (event) => {
    // If the document is 'hidden' and no previous hidden timestamp has been
    // set, update it based on the current event data.
    if (WINDOW$1.document.visibilityState === 'hidden' && firstHiddenTime > -1) {
        // If the event is a 'visibilitychange' event, it means the page was
        // visible prior to this change, so the event timestamp is the first
        // hidden time.
        // However, if the event is not a 'visibilitychange' event, then it must
        // be a 'prerenderingchange' event, and the fact that the document is
        // still 'hidden' from the above check means the tab was activated
        // in a background state and so has always been hidden.
        firstHiddenTime = event.type === 'visibilitychange' ? event.timeStamp : 0;

        // Remove all listeners now that a `firstHiddenTime` value has been set.
        removeChangeListeners();
    }
};

const removeChangeListeners = () => {
    removeEventListener('visibilitychange', onVisibilityUpdate, true);
    removeEventListener('prerenderingchange', onVisibilityUpdate, true);
};

const addChangeListeners = () => {
    addEventListener('visibilitychange', onVisibilityUpdate, true);
    // IMPORTANT: when a page is prerendering, its `visibilityState` is
    // 'hidden', so in order to account for cases where this module checks for
    // visibility during prerendering, an additional check after prerendering
    // completes is also required.
    addEventListener('prerenderingchange', onVisibilityUpdate, true);
};

const getVisibilityWatcher = () => {
    if (WINDOW$1.document && firstHiddenTime < 0) {
        // If the document is hidden when this code runs, assume it was hidden
        // since navigation start. This isn't a perfect heuristic, but it's the
        // best we can do until an API is available to support querying past
        // visibilityState.
        firstHiddenTime = initHiddenTime();
        addChangeListeners();
    }
    return {
        get firstHiddenTime() {
            return firstHiddenTime;
        },
    };
};

const whenActivated = (callback) => {
    if (WINDOW$1.document && WINDOW$1.document.prerendering) {
        addEventListener('prerenderingchange', () => callback(), true);
    } else {
        callback();
    }
};

const getNavigationEntry = (checkResponseStart = true) => {
    const navigationEntry =
        WINDOW$1.performance && WINDOW$1.performance.getEntriesByType && WINDOW$1.performance.getEntriesByType('navigation')[0];
    // Check to ensure the `responseStart` property is present and valid.
    // In some cases no value is reported by the browser (for
    // privacy/security reasons), and in other cases (bugs) the value is
    // negative or is larger than the current page time. Ignore these cases:
    // https://github.com/GoogleChrome/web-vitals/issues/137
    // https://github.com/GoogleChrome/web-vitals/issues/162
    // https://github.com/GoogleChrome/web-vitals/issues/275
    if (
        // sentry-specific change:
        // We don't want to check for responseStart for our own use of `getNavigationEntry`
        !checkResponseStart ||
        (navigationEntry && navigationEntry.responseStart > 0 && navigationEntry.responseStart < performance.now())
    ) {
        return navigationEntry;
    }
};
const getActivationStart = () => {
    const navEntry = getNavigationEntry();
    return (navEntry && navEntry.activationStart) || 0;
};
const initMetric = (name, value) => {
    const navEntry = getNavigationEntry();
    let navigationType = 'navigate';

    if (navEntry) {
        if ((WINDOW$1.document && WINDOW$1.document.prerendering) || getActivationStart() > 0) {
            navigationType = 'prerender';
        } else if (WINDOW$1.document && WINDOW$1.document.wasDiscarded) {
            navigationType = 'restore';
        } else if (navEntry.type) {
            navigationType = navEntry.type.replace(/_/g, '-') ;
        }
    }

    // Use `entries` type specific for the metric.
    const entries = [];

    return {
        name,
        value: typeof value === 'undefined' ? -1 : value,
        rating: 'good' , // If needed, will be updated when reported. `const` to keep the type from widening to `string`.
        delta: 0,
        entries,
        id: generateUniqueID(),
        navigationType,
    };
};

const observe = (
    type,
    callback,
    opts,
) => {
    try {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) {
            const po = new PerformanceObserver(list => {
                // Delay by a microtask to workaround a bug in Safari where the
                // callback is invoked immediately, rather than in a separate task.
                // See: https://github.com/GoogleChrome/web-vitals/issues/277
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                Promise.resolve().then(() => {
                    callback(list.getEntries() );
                });
            });
            po.observe(
                Object.assign(
                    {
                        type,
                        buffered: true,
                    },
                    opts || {},
                ) ,
            );
            return po;
        }
    } catch (e) {
        // Do nothing.
    }
    return;
};

const FCPThresholds = [1800, 3000];

const getRating = (value, thresholds) => {
    if (value > thresholds[1]) {
        return 'poor';
    }
    if (value > thresholds[0]) {
        return 'needs-improvement';
    }
    return 'good';
};
const bindReporter = (
    callback,
    metric,
    thresholds,
    reportAllChanges,
) => {
    let prevValue;
    let delta;
    return (forceReport) => {
        if (metric.value >= 0) {
            if (forceReport || reportAllChanges) {
                delta = metric.value - (prevValue || 0);

                // Report the metric if there's a non-zero delta or if no previous
                // value exists (which can happen in the case of the document becoming
                // hidden when the metric value is 0).
                // See: https://github.com/GoogleChrome/web-vitals/issues/14
                if (delta || prevValue === undefined) {
                    prevValue = metric.value;
                    metric.delta = delta;
                    metric.rating = getRating(metric.value, thresholds);
                    callback(metric);
                }
            }
        }
    };
};

const onFCP = (onReport, opts = {}) => {
    whenActivated(() => {
        const visibilityWatcher = getVisibilityWatcher();
        const metric = initMetric('FCP');
        let report;

        const handleEntries = (entries) => {
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    po.disconnect();

                    // Only report if the page wasn't hidden prior to the first paint.
                    if (entry.startTime < visibilityWatcher.firstHiddenTime) {
                        // The activationStart reference is used because FCP should be
                        // relative to page activation rather than navigation start if the
                        // page was prerendered. But in cases where `activationStart` occurs
                        // after the FCP, this time should be clamped at 0.
                        metric.value = Math.max(entry.startTime - getActivationStart(), 0);
                        metric.entries.push(entry);
                        report(true);
                    }
                }
            });
        };

        const po = observe('paint', handleEntries);

        if (po) {
            report = bindReporter(onReport, metric, FCPThresholds, opts.reportAllChanges);
        }
    });
};