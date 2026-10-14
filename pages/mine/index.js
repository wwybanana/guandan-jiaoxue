const { lessons } = require('../../data/lessons')
const { articles } = require('../../data/articles')
const { endgames } = require('../../data/endgames')
const { quizzes } = require('../../data/quizzes')
const progress = require('../../utils/progress')

function percent(done, total) {
  if (!total) return 0
  return Math.round((done * 100) / total)
}

function suggestion(store) {
  for (let i = 0; i < lessons.length; i += 1) {
    if (!store.lessons[lessons[i].id]) {
      return '下一节可以看「' + lessons[i].title + '」。'
    }
  }
  for (let i = 0; i < articles.length; i += 1) {
    if (!store.articles[articles[i].id]) {
      return '规则已经过了一遍，去看「' + articles[i].title + '」。'
    }
  }
  for (let i = 0; i < endgames.length; i += 1) {
    if (!store.endgames[endgames[i].id]) {
      return '试试残局：「' + endgames[i].title + '」。'
    }
  }
  for (let i = 0; i < quizzes.length; i += 1) {
    const record = store.quizzes[quizzes[i].id]
    if (!record || record.best < quizzes[i].questions.length) {
      return '还有测验没拿满分，可以再做一次「' + quizzes[i].title + '」。'
    }
  }
  return '规则、拆牌和测验都过完了。上桌之前，把进贡和过 A 跟牌友对一下。'
}

Page({
  data: {
    headline: '还没开始上课',
    suggestion: '',
    stats: [],
    quizStats: []
  },
  onLoad() {
    this.refresh()
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    const store = progress.read()
    const lessonDone = Object.keys(store.lessons).length
    const articleDone = Object.keys(store.articles).length
    const endgameDone = Object.keys(store.endgames).length
    let headline = '还没开始上课'
    if (lessonDone >= lessons.length) headline = '规则课已经学完'
    else if (lessonDone > 0) headline = '已学完 ' + lessonDone + ' 节规则课'
    const stats = [
      { key: 'lessons', name: '规则学习', done: lessonDone, total: lessons.length, percent: percent(lessonDone, lessons.length) },
      { key: 'articles', name: '拆牌文章', done: articleDone, total: articles.length, percent: percent(articleDone, articles.length) },
      { key: 'endgames', name: '残局要点', done: endgameDone, total: endgames.length, percent: percent(endgameDone, endgames.length) }
    ]
    const quizStats = quizzes.map((quiz) => {
      const record = store.quizzes[quiz.id]
      return {
        id: quiz.id,
        title: quiz.title,
        label: record ? ('最高 ' + record.best + '/' + record.total + ' · 最近 ' + record.last + '/' + record.total) : '还没做过'
      }
    })
    this.setData({
      headline: headline,
      suggestion: suggestion(store),
      stats: stats,
      quizStats: quizStats
    })
  },
  openQuiz(e) {
    wx.navigateTo({ url: '/pages/quiz/play?id=' + e.currentTarget.dataset.id })
  },
  openNote() {
    wx.navigateTo({ url: '/pages/rules/note' })
  },
  goRules() {
    wx.switchTab({ url: '/pages/rules/index' })
  },
  reset() {
    const page = this
    wx.showModal({
      title: '清空学习记录？',
      content: '课节、残局和测验分数都会去掉。',
      confirmText: '清空',
      confirmColor: '#b23a2f',
      success(res) {
        if (!res.confirm) return
        progress.reset()
        page.refresh()
        wx.showToast({ title: '已清空', icon: 'none' })
      }
    })
  }
})
