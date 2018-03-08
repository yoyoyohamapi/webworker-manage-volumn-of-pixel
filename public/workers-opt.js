importScripts('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js')
this.onmessage = function(evt) {  
  const data = evt.data;  // 第一层的像素数据
  const dataLen = data.length
  const volumnHeight = 512
  const range = _.range(0, volumnHeight)
  const arr1 = range.map(() => data)
  const arr2 = range.map(() => data)
  // 在此对两个像素体数据做16位混色算法，合并两个像素体
  // http://blog.csdn.net/cuixiping/article/details/1698835 算法参考地址
  const arr = []
  for (let i = 0; i < volumnHeight; i++) {
    const tempArr = new Uint8ClampedArray(dataLen)
    const tempArr1 = arr1[i]
    const tempArr2 = arr2[i]
    for (let j = 0; j < dataLen; j++) {
      const remainder = j % 4
      // 获得透明度通道索引
      const alphaIndex = j + 3 - remainder
      // 获得各自透明度
      const alpha1 = tempArr1[alphaIndex]
      const alpha2 = tempArr2[alphaIndex]
      const alpha =  1 - (1 - alpha1) * (1 -alpha2)
      const pixel1 = tempArr1[j]
      const pixel2 = tempArr2[j]
      // 处理 RGB 通道
      if (remainder !== 0) {
        const pixel = pixel1 * alpha1 + pixel2 * alpha2 * (1 - alpha1) 
        tempArr[j] = pixel / alpha
      }
      // 处理 alpha 通道
      if (remainder === 3) {
        tempArr[j] = alpha
      }
    }
    arr.push(tempArr)
  }
  // 返回数据给调用者  
  postMessage(arr)
}

