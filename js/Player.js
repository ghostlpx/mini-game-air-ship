export default class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 25
    this.velocityY = 0
    this.velocityX = 0 // 保留velocityX用于平滑移动
    this.targetX = x // 目标横坐标
    this.moveSpeed = 15 // 移动到目标位置的速度
    this.gravity = 0.8
    this.jumpPower = -15
    this.maxFallSpeed = 12
    this.maxMoveSpeed = 12
    this.friction = 0.85
    this.isJumping = false
    this.rotation = 0
    this.trail = [] // 尾迹效果
  }
  
  update(deltaTime) {
    // 应用重力
    this.velocityY += this.gravity
    if (this.velocityY > this.maxFallSpeed) {
      this.velocityY = this.maxFallSpeed
    }
    
    // 移动到目标位置
    const deltaX = this.targetX - this.x
    if (Math.abs(deltaX) > 2) { // 如果距离目标位置超过2像素
      this.velocityX = deltaX * this.moveSpeed * deltaTime / 1000
      // 限制最大移动速度
      if (this.velocityX > this.maxMoveSpeed) this.velocityX = this.maxMoveSpeed
      if (this.velocityX < -this.maxMoveSpeed) this.velocityX = -this.maxMoveSpeed
    } else {
      this.x = this.targetX // 接近目标时直接设置位置
      this.velocityX = 0
    }
    
    // 更新位置
    this.y += this.velocityY
    this.x += this.velocityX
    
    // 边界检测 - 确保玩家不会飞出屏幕
    if (this.x < this.radius) {
      this.x = this.radius
      this.targetX = this.radius
      this.velocityX = 0
    } else if (this.x > window.innerWidth - this.radius) {
      this.x = window.innerWidth - this.radius
      this.targetX = window.innerWidth - this.radius
      this.velocityX = 0
    }
    
    // 更新旋转
    this.rotation += 0.1
    
    // 更新尾迹
    this.trail.push({ x: this.x, y: this.y, alpha: 1 })
    if (this.trail.length > 10) {
      this.trail.shift()
    }
    
    // 更新尾迹透明度
    for (let i = 0; i < this.trail.length; i++) {
      this.trail[i].alpha = (i + 1) / this.trail.length * 0.8
    }
  }
  
  jump() {
    this.velocityY = this.jumpPower
    this.isJumping = true
  }
  
  setTargetX(targetX) {
    // 确保目标位置在屏幕范围内
    this.targetX = Math.max(this.radius, Math.min(targetX, window.innerWidth - this.radius))
  }
  
  reset(x, y) {
    this.x = x
    this.y = y
    this.targetX = x
    this.velocityY = 0
    this.velocityX = 0
    this.rotation = 0
    this.trail = []
  }
  
  render(ctx) {
    // 渲染尾迹
    this.renderTrail(ctx)
    
    // 渲染太空船
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    
    // 太空船主体（三角形）
    ctx.fillStyle = '#4FC3F7'
    ctx.beginPath()
    ctx.moveTo(0, -this.radius)
    ctx.lineTo(-this.radius * 0.7, this.radius)
    ctx.lineTo(this.radius * 0.7, this.radius)
    ctx.closePath()
    ctx.fill()
    
    // 太空船边框
    ctx.strokeStyle = '#01579B'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // 发光效果
    ctx.shadowColor = '#4FC3F7'
    ctx.shadowBlur = 15
    ctx.fill()
    
    // 引擎火焰
    if (this.velocityY > 0) {
      ctx.fillStyle = '#FF5722'
      ctx.beginPath()
      ctx.moveTo(-this.radius * 0.3, this.radius)
      ctx.lineTo(0, this.radius + 15)
      ctx.lineTo(this.radius * 0.3, this.radius)
      ctx.closePath()
      ctx.fill()
      
      ctx.fillStyle = '#FFC107'
      ctx.beginPath()
      ctx.moveTo(-this.radius * 0.2, this.radius)
      ctx.lineTo(0, this.radius + 10)
      ctx.lineTo(this.radius * 0.2, this.radius)
      ctx.closePath()
      ctx.fill()
    }
    
    ctx.restore()
  }
  
  renderTrail(ctx) {
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i]
      ctx.save()
      ctx.globalAlpha = point.alpha
      ctx.fillStyle = '#81D4FA'
      ctx.beginPath()
      ctx.arc(point.x, point.y, this.radius * 0.3 * point.alpha, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
} 