# Web Worker 对像素体数据的管理 

## 问题

1. Web Worker 对传递的参数做深拷贝，所以当参数体积大，则做拷贝会在让主线程卡死
2. 子线程对像素级别计算，会让浏览器崩溃，但是cpu和内存并没有占用太多资源。不清楚崩溃原因

## 优化

- [x] 使用 Typed Array 节约内存
- [x] 使用多 worker 优化计算性能