export default class Performance {
  constructor() {
    this.fps = 60
    this.frames = 0
    this.lastFpsTime = Date.now()
    this.frameTimeHistory = []
    this.maxFrameTimeHistory = 10
  }
  
  update() {
    this.frames++
    const now = Date.now()
    
    // 每秒计算一次FPS
    if (now - this.lastFpsTime >= 1000) {
      this.fps = Math.round(this.frames * 1000 / (now - this.lastFpsTime))
      this.frames = 0
      this.lastFpsTime = now
    }
  }
  
  getFPS() {
    return this.fps
  }
  
  // 获取性能等级 (1-5, 5最高)
  getPerformanceLevel() {
    if (this.fps >= 55) return 5      // 高性能
    if (this.fps >= 45) return 4      // 良好
    if (this.fps >= 35) return 3      // 中等
    if (this.fps >= 25) return 2      // 较低
    return 1                          // 低性能
  }
  
  // 获取建议的粒子数量
  getRecommendedParticleCount() {
    const level = this.getPerformanceLevel()
    switch (level) {
      case 5: return 15  // 高性能设备
      case 4: return 12
      case 3: return 8
      case 2: return 5
      case 1: return 3   // 低性能设备
      default: return 8
    }
  }
  
  // 获取建议的星星数量
  getRecommendedStarCount() {
    const level = this.getPerformanceLevel()
    switch (level) {
      case 5: return 200
      case 4: return 150
      case 3: return 100
      case 2: return 75
      case 1: return 50
      default: return 100
    }
  }
  
  // 是否启用发光效果
  shouldEnableGlow() {
    return this.getPerformanceLevel() >= 3
  }
} 