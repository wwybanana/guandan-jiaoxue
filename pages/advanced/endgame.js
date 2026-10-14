const { endgames } = require('../../data/endgames')
const progress = require('../../utils/progress')

function findEndgame(id) {
  for (let i = 0; i < endgames.length; i += 1) {
    if (endgames[i].id === id) return endgames[i]
  }
  return null
}

function toneOf(level) {
  if (level === '高级') return 'hard'
  if (level === '中级') return 'mid'
  return 'easy'
}

Page({
  data: {
    item: null,
    missing: false,
    tone: 'easy',
    picked: '',
    locked: false,
    letters: ['A', 'B', 'C', 'D']
  },
  onLoad(query) {
    const item = findEndgame(query.id)
    if (!item) {
      this.setData({ missing: true })
      return
    }
    wx.setNavigationBarTitle({ title: item.level + ' · 残局' })
    this.setData({
      item: item,
      tone: toneOf(item.level)
    })
  },
  choose(e) {
    if (this.data.locked || !this.data.item) return
    const picked = e.currentTarget.dataset.opt
    if (!picked) return
    progress.mark('endgames', this.data.item.id)
    this.setData({ picked: picked, locked: true })
  },
  back() {
    wx.navigateBack({
      fail() {
        wx.switchTab({ url: '/pages/advanced/index' })
      }
    })
  }
})
