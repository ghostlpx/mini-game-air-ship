// 微信小游戏环境适配器
console.log('开始初始化微信小游戏适配器...')

try {
  // 1. 创建主画布（这是微信小游戏的标准做法）
  const canvas = wx.createCanvas()
  
  // 2. 获取系统信息
  const systemInfo = wx.getSystemInfoSync()
  console.log('系统信息:', systemInfo)
  
  // 3. 设置画布尺寸为屏幕尺寸
  canvas.width = systemInfo.screenWidth
  canvas.height = systemInfo.screenHeight
  
  console.log('Canvas尺寸:', {
    width: canvas.width,
    height: canvas.height
  })
  
  // 4. 获取绘图上下文
  const context = canvas.getContext('2d')
  
  // 5. 设置全局变量
  GameGlobal.canvas = canvas
  GameGlobal.context = context
  
  // 6. 创建window对象（兼容浏览器API）
  if (!GameGlobal.window) {
    GameGlobal.window = {}
  }
  
  GameGlobal.window.canvas = canvas
  GameGlobal.window.context = context
  GameGlobal.window.innerWidth = systemInfo.screenWidth
  GameGlobal.window.innerHeight = systemInfo.screenHeight
  GameGlobal.window.devicePixelRatio = systemInfo.pixelRatio
  
  // 7. 触摸事件适配
  GameGlobal.window.addEventListener = function(type, listener) {
    switch(type) {
      case 'touchstart':
        wx.onTouchStart(listener)
        break
      case 'touchmove':
        wx.onTouchMove(listener)
        break
      case 'touchend':
        wx.onTouchEnd(listener)
        break
      case 'touchcancel':
        wx.onTouchCancel(listener)
        break
    }
  }
  
  // 8. 动画帧适配
  GameGlobal.window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 1000 / 60)
  }
  
  GameGlobal.window.cancelAnimationFrame = function(id) {
    clearTimeout(id)
  }
  
  // 9. 图片加载适配
  GameGlobal.window.Image = function() {
    return wx.createImage()
  }
  
  // 10. 测试绘制（确保Canvas正常工作）
  context.fillStyle = '#ff0000'
  context.fillRect(10, 10, 50, 50)
  console.log('测试绘制完成 - 如果看到红色方块说明Canvas正常工作')
  
  console.log('微信小游戏适配器初始化完成！')
  console.log('GameGlobal对象:', {
    hasCanvas: !!GameGlobal.canvas,
    hasContext: !!GameGlobal.context,
    windowWidth: GameGlobal.window.innerWidth,
    windowHeight: GameGlobal.window.innerHeight
  })
  
} catch (error) {
  console.error('微信小游戏适配器初始化失败:', error)
  console.error('错误堆栈:', error.stack)
} 