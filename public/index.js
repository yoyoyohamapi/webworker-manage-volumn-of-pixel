// 创建画布 拿到一层 100 * 100 的像素数据
const c = document.getElementById('canvas_a')
const ctx = c.getContext('2d')
ctx.rect(0,0,512,512)
ctx.fillStyle="green"
ctx.fill()
const imageData = ctx.getImageData(0, 0, 512, 512).data

// 创建512层正方体像素数据
const arr = []
for (let i = 0; i < 512; i++) {
	arr.push(imageData)
}

const workerNum = navigator.hardwareConcurrency
const workers = []
let pending = workerNum
const step = 512 / workerNum
const finalArr = new Array(workerNum)
for (let i = 0; i < workerNum; i++) {
  const worker = new Worker("static/workers-opt.js")
  worker.onmessage =function(evt){
    finalArr[i] = evt.data
    if (--pending === 0) {
      // 展平
      const flattend = _.flattenDepth(finalArr, 1)
      console.timeEnd('worker')
      $btn.innerHTML = '处理数据'
      $btn.disabled = false
      console.log(flattend)
    }
  }
  workers.push(worker)
}

let handle = function () {
	$btn.innerHTML = 'worker正在处理数据'
	$btn.disabled = true
  // 创建一个worker webworker对传递的参数是要做深拷贝，所以直接传递大数据体会造成界面卡死，我们先只传第一层给子线程
  console.time('worker')
  workers.forEach((worker, index) => {
    const data = arr.slice(index * step, (index + 1) * step)
    worker.postMessage([data, step])
  })
}

const $btn = document.getElementById('btn')

$btn.onclick = handle



