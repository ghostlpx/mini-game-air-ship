// 微信小游戏API适配
try {
  const canvas = wx.createCanvas()
  const context = canvas.getContext('2d')

  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync()
  const dpr = systemInfo.pixelRatio || 1

  // 设置Canvas尺寸
  canvas.width = systemInfo.screenWidth * dpr
  canvas.height = systemInfo.screenHeight * dpr

  // 设置显示尺寸
  canvas.style = canvas.style || {}
  canvas.style.width = systemInfo.screenWidth + 'px'
  canvas.style.height = systemInfo.screenHeight + 'px'

  // 缩放Canvas绘制上下文
  context.scale(dpr, dpr)

  // 全局变量设置
  window.canvas = canvas
  window.context = context
  window.innerWidth = systemInfo.screenWidth
  window.innerHeight = systemInfo.screenHeight
  window.devicePixelRatio = systemInfo.pixelRatio

  // 触摸事件适配
  canvas.addEventListener = function(type, listener) {
    if (type === 'touchstart') {
      wx.onTouchStart(listener)
    } else if (type === 'touchmove') {
      wx.onTouchMove(listener)
    } else if (type === 'touchend') {
      wx.onTouchEnd(listener)
    } else if (type === 'touchcancel') {
      wx.onTouchCancel(listener)
    }
  }

  // requestAnimationFrame适配
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 1000 / 60)
  }

  window.cancelAnimationFrame = function(id) {
    clearTimeout(id)
  }

  // 添加图片加载支持
  window.Image = wx.createImage

  console.log('微信小游戏适配器初始化成功')
  
} catch (error) {
  console.error('微信小游戏适配器初始化失败:', error)
} 