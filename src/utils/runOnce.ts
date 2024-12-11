/**
 * 只执行一次
 * @param cb
 */
export const runOnce = (cb: () => void) => {
    let called = false;
    return () => {
        if (!called) {
            cb();
            called = true;
        }
    };
};
