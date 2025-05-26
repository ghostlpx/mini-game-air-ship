export default class Background {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.stars = []
    this.nebulae = []
    
    // 创建星星
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 1,
        brightness: Math.random()
      })
    }
    
    // 创建星云
    for (let i = 0; i < 3; i++) {
      this.nebulae.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 50 + Math.random() * 100,
        color: this.getRandomNebulaColor(),
        alpha: 0.1 + Math.random() * 0.2,
        drift: Math.random() * 0.5 + 0.2
      })
    }
  }
  
  getRandomNebulaColor() {
    const colors = ['#4A148C', '#1A237E', '#0D47A1', '#01579B', '#004D40']
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  update(deltaTime, speed) {
    // 更新星星位置
    for (let star of this.stars) {
      star.y += star.speed * speed
      star.brightness = 0.3 + 0.7 * Math.sin(Date.now() * 0.002 + star.x * 0.01)
      
      // 星星离开屏幕后重新从顶部出现
      if (star.y > this.height + 10) {
        star.y = -10
        star.x = Math.random() * this.width
      }
    }
    
    // 更新星云
    for (let nebula of this.nebulae) {
      nebula.y += speed * nebula.drift
      
      if (nebula.y > this.height + nebula.radius) {
        nebula.y = -nebula.radius
        nebula.x = Math.random() * this.width
      }
    }
  }
  
  render(ctx) {
    // 渲染深空背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#000011')
    gradient.addColorStop(0.5, '#001122')
    gradient.addColorStop(1, '#000033')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)
    
    // 渲染星云
    for (let nebula of this.nebulae) {
      ctx.save()
      ctx.globalAlpha = nebula.alpha
      
      const nebulaGradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      )
      nebulaGradient.addColorStop(0, nebula.color)
      nebulaGradient.addColorStop(1, 'rgba(0,0,0,0)')
      
      ctx.fillStyle = nebulaGradient
      ctx.beginPath()
      ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    // 渲染星星
    for (let star of this.stars) {
      ctx.save()
      ctx.globalAlpha = star.brightness
      ctx.fillStyle = '#FFFFFF'
      
      // 添加发光效果
      ctx.shadowColor = '#FFFFFF'
      ctx.shadowBlur = star.size * 2
      
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    // 渲染远景星星（更小更暗）
    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.fillStyle = '#CCCCCC'
    
    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(Date.now() * 0.0001 + i) * 0.5 + 0.5) * this.width
      const y = (Math.cos(Date.now() * 0.0002 + i * 2) * 0.5 + 0.5) * this.height
      
      ctx.beginPath()
      ctx.arc(x, y, 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }
} 