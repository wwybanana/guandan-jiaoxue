const { lessons } = require('../../data/lessons')
const { C } = require('../../utils/cards')
const progress = require('../../utils/progress')

const heroCards = [
  C('hero-2', '2', 'H', '配'),
  C('hero-a', 'A', 'S'),
  C('hero-k', 'K', 'D'),
  C('hero-j', 'RJ', 'J')
]

Page({
  data: {
    heroCards: heroCards,
    list: [],
    read: 0,
    total: lessons.length,
    percent: 0,
    continueLabel: '开始第一课'
  },
  onLoad() {
    this.refresh()
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    const store = progress.read()
    let read = 0
    const list = lessons.map((lesson) => {
      const done = !!store.lessons[lesson.id]
      if (done) read += 1
      return {
        id: lesson.id,
        no: lesson.no,
        title: lesson.title,
        summary: lesson.summary,
        minutes: lesson.minutes,
        done: done
      }
    })
    const total = lessons.length
    let continueLabel = '开始第一课'
    if (read >= total) continueLabel = '从第一课再看'
    else if (read > 0) continueLabel = '继续学习'
    this.setData({
      list: list,
      read: read,
      total: total,
      percent: total ? Math.round((read * 100) / total) : 0,
      continueLabel: continueLabel
    })
  },
  openLesson(e) {
    wx.navigateTo({ url: '/pages/rules/detail?id=' + e.currentTarget.dataset.id })
  },
  continueStudy() {
    let next = this.data.list[0]
    for (let i = 0; i < this.data.list.length; i += 1) {
      if (!this.data.list[i].done) {
        next = this.data.list[i]
        break
      }
    }
    if (!next) return
    wx.navigateTo({ url: '/pages/rules/detail?id=' + next.id })
  },
  openNote() {
    wx.navigateTo({ url: '/pages/rules/note' })
  },
  onShareAppMessage() {
    return {
      title: '掼蛋课堂：六节课看懂规则',
      path: '/pages/rules/index'
    }
  }
})
