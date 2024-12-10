# WebMonitor

[//]: # "## Installation"

[//]: #

[//]: # "### Using Yarn or NPM"

[//]: #

[//]: # "```sh"

[//]: # "$ yarn add --dev @WebGuardMonitor/WebMonitor"

[//]: # "```"

[//]: #

[//]: # "or"

[//]: #

[//]: # "```sh"

[//]: # "$ npm install @WebGuardMonitor/WebMonitor"

[//]: # "```"

[//]: #

[//]: # "### Usage ###"

[//]: #

[//]: # "```javascript"

[//]: # "import {initMonitor} from '@WebGuardMonitor/WebMonitor';"

[//]: #

[//]: # "initMonitor()"

[//]: # "```"

[//]: #

[//]: # "### In a Browser"

[//]: #

[//]: # "```html"

[//]: #

[//]: # '<script src="../node_modules/@WebGuardMonitor/WebMonitor/dist/webguard.min.js"></script>'

[//]: # "```"

## 需要实现功能：

1. 性能监控
    - FP · 首次绘制
    - FCP · 首次内容渲染
    - FMP · 首次渲染关键内容绘制
    - LCP · 最大内容绘制
    - FID · 度量用户第一次与页面交互的延迟时间
    - SI · 速度指数
    - CLS · 布局偏移指数
    - TTI · 首次交互时间
    - TBT · 阻塞总时间
    - TTFB · 首字节时间
    - FPS · 监测浏览器卡顿情况
    - INP · 所有点击、点按和键盘互动的延迟时间
    - TBT · 总阻塞时间
2. 异常监控
    - 内存溢出
    - JS 错误
    - Promise 错误
    - ajax/fetch 错误
    - 资源加载错误
    - WebSocket 错误
    - 自定义错误

### 结构

```markdown
src/
    |- utils/ 工具函数
    |- error/ 异常监控
    |- metrics/ 性能监控指标数据
    index.ts
```