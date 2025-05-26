export default class Storage {
  static setItem(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.error('存储失败:', e)
    }
  }
  
  static getItem(key, defaultValue = null) {
    try {
      return wx.getStorageSync(key) || defaultValue
    } catch (e) {
      console.error('读取失败:', e)
      return defaultValue
    }
  }
  
  static removeItem(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.error('删除失败:', e)
    }
  }
  
  // 游戏数据相关方法
  static saveHighScore(score) {
    const currentHigh = this.getHighScore()
    if (score > currentHigh) {
      this.setItem('highScore', score)
      return true // 返回是否是新纪录
    }
    return false
  }
  
  static getHighScore() {
    return this.getItem('highScore', 0)
  }
  
  static saveBestDistance(distance) {
    const currentBest = this.getBestDistance()
    if (distance > currentBest) {
      this.setItem('bestDistance', distance)
      return true
    }
    return false
  }
  
  static getBestDistance() {
    return this.getItem('bestDistance', 0)
  }
  
  static saveGameSettings(settings) {
    this.setItem('gameSettings', settings)
  }
  
  static getGameSettings() {
    return this.getItem('gameSettings', {
      soundEnabled: true,
      vibrationEnabled: true
    })
  }
} 