const { lessons } = require('../../data/lessons')
const progress = require('../../utils/progress')
const share = require('../../utils/share')
const { LEVELS, rankStrip, rankHint } = require('../../utils/ranks')

function findLesson(id) {
  for (let i = 0; i < lessons.length; i += 1) {
    if (lessons[i].id === id) return { lesson: lessons[i], index: i }
  }
  return null
}

Page({
  data: {
    lesson: null,
    missing: false,
    levels: LEVELS,
    currentLevel: '2',
    rankCards: [],
    rankHintText: '点任意一张，看它在这一把的位置。现在是打 2。',
    galleryPick: {},
    compareShow: {},
    comparePick: {},
    prevId: '',
    nextId: ''
  },
  onLoad(query) {
    this.loadLesson(query.id)
  },
  onShow() {
    share.enable()
  },
  loadLesson(id) {
    const found = findLesson(id)
    if (!found) {
      this.setData({ missing: true, lesson: null })
      wx.setNavigationBarTitle({ title: '规则学习' })
      return
    }
    const lesson = found.lesson
    const galleryPick = {}
    lesson.blocks.forEach((block) => {
      if (block.type === 'gallery' && block.items && block.items.length) {
        galleryPick[block.id] = block.items[0].id
      }
    })
    progress.mark('lessons', lesson.id)
    const prev = found.index > 0 ? lessons[found.index - 1] : null
    const next = found.index < lessons.length - 1 ? lessons[found.index + 1] : null
    wx.setNavigationBarTitle({ title: lesson.title })
    this.setData({
      missing: false,
      lesson: lesson,
      galleryPick: galleryPick,
      compareShow: {},
      comparePick: {},
      currentLevel: '2',
      rankCards: rankStrip('2'),
      rankHintText: '点任意一张，看它在这一把的位置。现在是打 2。',
      prevId: prev ? prev.id : '',
      nextId: next ? next.id : ''
    })
  },
  pickGallery(e) {
    const gid = e.currentTarget.dataset.gid
    const pick = e.currentTarget.dataset.pick
    if (!gid || !pick) return
    this.setData({ ['galleryPick.' + gid]: pick })
  },
  pickCompare(e) {
    const id = e.currentTarget.dataset.bid
    const side = e.currentTarget.dataset.side
    if (!id || this.data.compareShow[id]) return
    this.setData({
      ['comparePick.' + id]: side,
      ['compareShow.' + id]: true
    })
  },
  setLevel(e) {
    const level = e.currentTarget.dataset.lv
    if (!level) return
    this.setData({
      currentLevel: level,
      rankCards: rankStrip(level),
      rankHintText: '现在是打 ' + level + '。红桃 ' + level + ' 是逢人配。点一张牌看它的位置。'
    })
  },
  onRankTap(e) {
    const rank = e.detail && e.detail.rank
    if (!rank) return
    this.setData({ rankHintText: rankHint(this.data.currentLevel, rank) })
  },
  goPrev() {
    if (!this.data.prevId) return
    wx.redirectTo({ url: '/pages/rules/detail?id=' + this.data.prevId })
  },
  goNext() {
    if (!this.data.nextId) {
      wx.switchTab({ url: '/pages/rules/index' })
      return
    }
    wx.redirectTo({ url: '/pages/rules/detail?id=' + this.data.nextId })
  },
  goAdvanced() {
    wx.switchTab({ url: '/pages/advanced/index' })
  },
  backHome() {
    wx.switchTab({ url: '/pages/rules/index' })
  },
  onShareAppMessage() {
    const lesson = this.data.lesson
    if (!lesson) return share.message('掼蛋课堂：六节课看懂规则', '/pages/rules/index')
    return share.message('掼蛋课堂：' + lesson.title, '/pages/rules/detail?id=' + lesson.id)
  },
  onShareTimeline() {
    const lesson = this.data.lesson
    if (!lesson) return share.timeline('掼蛋课堂：六节课看懂规则')
    return share.timeline('掼蛋课堂：' + lesson.title, 'id=' + lesson.id)
  }
})
