const SingleFrameMaxRenderTime = 100; // 单位ms
// https://github.com/coderyangx/obsidian/blob/main/puppeteer/runner/src/metrics/fps/fps-monitor.ts
export class FPSMonitor {
    private _beginTime = 0;
    private _prevTime = 0;
    private _fpsArr: Array<{ value: number }> = []; // 单帧耗时数组
    private _frameCount = 0;
    private _raf?: number; // 执行帧

    loop() {
        const time = performance.now();
        // console.log('每一帧执行时间：', time - this._prevTime, performance.now(), this._prevTime);
        this._fpsArr.push({value: time - this._prevTime});
        this._prevTime = time;
        this._frameCount++;
        this._raf = requestAnimationFrame(() => {
            this.loop();
        });
    }

    start() {
        this._beginTime = performance.now();
        this._prevTime = this._beginTime;
        this._raf = requestAnimationFrame(() => {
            this.loop();
        });
    }

    stop() {
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = undefined;
        }
    }

    getFPSMetrics() {
        return {
            worstFrameData: this._getWorstFrameData(),
            maxRenderTimePerFrame: this._getPerFrameMaxRenderTime(),
            averageFPS: this._getAverageFps(),
            // 总卡顿帧数
            jankFrameCount: this._fpsArr.filter((o) => o.value > SingleFrameMaxRenderTime).length,
            // 总帧数
            totalFrameCount: this._fpsArr.length
        };
    }

    /**
     * 计算 fps 的平均值
     */
    private _getAverageFps() {
        if (!this._fpsArr.length) {
            return undefined;
        }
        const totalRenderTime = this._fpsArr.reduce((acc, cur) => acc + cur.value, 0);
        const averageFps = 1000 / (totalRenderTime / this._fpsArr.length);
        console.log('fps-monitor----_getAverageFps：', this._fpsArr, totalRenderTime, averageFps.toFixed(2));

        return +averageFps.toFixed(2);
    }

    private _getPerFrameMaxRenderTime() {
        if (!this._fpsArr.length) {
            return;
        }
        console.log('fps-monitor----_getPerFrameMaxRenderTime', Math.max(...this._fpsArr.map((o) => o.value)));

        return Math.round(Math.max(...this._fpsArr.map((o) => o.value)));
    }

    /**
     * @param {*} frameCostArr 渲染每帧花费时间的数组
     * @returns worstStuckFps-worstTotalStuckFrames 最差的卡顿帧对应的fps-最差的卡顿帧对应的卡顿总帧数
     */
    private _getWorstFrameData() {
        if (!this._fpsArr.length) {
            return undefined;
        }
        let worstStuckFps: number | undefined; // 最差的卡顿帧对应的fps
        let stuckStart = 0; // 卡顿开始帧的下标
        let stuckEnd = 0; // 卡顿结束帧下标
        let worstTotalStuckFrames = 0; // 最差的卡顿帧对应的卡顿总帧数
        // 末尾加一个0后是为了避免最后一帧时长依然大于singleFrameMaxRenderTime导致无法正常计算stuckEnd的情况
        [...this._fpsArr, {value: 0}].forEach((item, index) => {
            const isStuckFrame = item.value >= SingleFrameMaxRenderTime;

            if (isStuckFrame && (stuckStart < stuckEnd || stuckStart === 0)) {
                stuckStart = index;
            }
            // [20, 200, 100, 20]
            if (!isStuckFrame && this._fpsArr[index - 1].value >= SingleFrameMaxRenderTime && index > stuckStart) {
                stuckEnd = index;
            }
            if (stuckEnd > stuckStart) {
                const totalStuckFrames = stuckEnd - stuckStart;
                // 卡顿总时长
                const totalStuckTime = this._fpsArr.slice(stuckStart, stuckEnd).reduce((prev, cur) => +prev + +cur.value, 0);
                const stuckFps = (totalStuckFrames / totalStuckTime) * 1000; // (2 / 200+100) * 1000
                if (worstStuckFps === undefined || stuckFps < worstStuckFps) {
                    worstStuckFps = stuckFps;
                    worstTotalStuckFrames = totalStuckFrames;
                }
            }
        });
        if (worstStuckFps) {
            return {
                fps: +worstStuckFps.toFixed(2),
                count: worstTotalStuckFrames
            };
        }
        return undefined;
    }
}

// 上一帧的时间戳
let lastFrameTime: number = performance.now();
// 记录帧数
let frameCount: number = 0;
// 实时FPS
let fps: number = 0;
// FPS阈值，用于检测卡顿
const fpsThreshold: number = 20;
// 累计低于阈值的帧数
let lagFrames: number = 0;
// 允许低FPS的帧数上限
const lagThreshold: number = 10;


const getFPSMetrics = () => {
    const now: number = performance.now();
    frameCount++;

    // 每秒更新一次FPS
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;

        // 判断是否处于卡顿状态
        if (fps < fpsThreshold) {
            lagFrames++;
        } else {
            lagFrames = 0; // 恢复正常时重置计数
        }

        // 显示或隐藏卡顿警告
        if (lagFrames >= lagThreshold) {
            console.log(`当前处于卡顿，${fps}`)
        } else {
            console.log(`当前流畅，${fps}`)
        }
    }

    // 下一帧继续更新
    requestAnimationFrame(getFPSMetrics);
}

/**
 * 获取 FPS（Frames Per Second）数据过于庞大，不收集
 * 每秒钟渲染的帧数，用来衡量网页或Web应用程序的动画或交互响应的平滑度。
 */
export const getFPS = () => {
    getFPSMetrics()
    // const x = new FPSMonitor();
    // x.start()
    // x.getFPSMetrics()
    // var fps_compatibility = function () {
    //     return (
    //         window.requestAnimationFrame ||
    //         window.webkitRequestAnimationFrame ||
    //         function (callback) {
    //             window.setTimeout(callback, 1000 / 60);
    //         }
    //     );
    // }();
    // var fps_config = {
    //     lastTime: performance.now(),
    //     lastFameTime: performance.now(),
    //     frame: 0
    // }
    // var fps_loop = function () {
    //     var _first = performance.now(), _diff = (_first - fps_config.lastFameTime);
    //     fps_config.lastFameTime = _first;
    //     var fps = Math.round(1000 / _diff);
    //     fps_config.frame++;
    //     if (_first > 1000 + fps_config.lastTime) {
    //         // var fps = Math.round( ( fps_config.frame * 1000 ) / ( _first - fps_config.lastTime ) );
    //         var fps = (fps_config.frame * 1000) / (_first - fps_config.lastTime);
    //         console.log(`time: ${new Date()} fps is：`, fps);
    //         fps_config.frame = 0;
    //         fps_config.lastTime = _first;
    //     }
    //
    //     fps_compatibility(fps_loop);
    // }
    // fps_loop();

    // function isBlocking(fpsList, below = 20, last = 3) {
    //     var count = 0
    //     for (var i = 0; i < fpsList.length; i++) {
    //         if (fpsList[i] && fpsList[i] < below) {
    //             count++;
    //         } else {
    //             count = 0
    //         }
    //         if (count >= last) {
    //             return true
    //         }
    //     }
    //     return false
    // }

}