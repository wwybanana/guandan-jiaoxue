const { articles } = require('../../data/articles')
const { endgames } = require('../../data/endgames')
const { quizzes } = require('../../data/quizzes')
const progress = require('../../utils/progress')

const LEVELS = ['初级', '中级', '高级']

Page({
  data: {
    articles: [],
    groups: [],
    quizzes: [],
    articleRead: 0,
    articleTotal: articles.length,
    endgameRead: 0,
    endgameTotal: endgames.length
  },
  onLoad() {
    this.refresh()
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    const store = progress.read()
    let articleRead = 0
    const articleList = articles.map((article, index) => {
      const done = !!store.articles[article.id]
      if (done) articleRead += 1
      return {
        id: article.id,
        no: index + 1,
        title: article.title,
        summary: article.summary,
        minutes: article.minutes,
        done: done
      }
    })
    let endgameRead = 0
    const groups = LEVELS.map((level) => {
      const tone = level === '高级' ? 'hard' : level === '中级' ? 'mid' : 'easy'
      const items = []
      endgames.forEach((item) => {
        if (item.level !== level) return
        const done = !!store.endgames[item.id]
        if (done) endgameRead += 1
        items.push({
          id: item.id,
          title: item.title,
          done: done
        })
      })
      return { level: level, tone: tone, items: items }
    })
    const quizList = quizzes.map((quiz) => {
      const record = store.quizzes[quiz.id]
      let label = '未作答 · ' + quiz.questions.length + ' 题'
      if (record) {
        label = '最高 ' + record.best + '/' + record.total + ' · 最近 ' + record.last + '/' + record.total
      }
      return {
        id: quiz.id,
        title: quiz.title,
        summary: quiz.summary,
        label: label,
        done: !!(record && record.best === record.total)
      }
    })
    this.setData({
      articles: articleList,
      groups: groups,
      quizzes: quizList,
      articleRead: articleRead,
      endgameRead: endgameRead
    })
  },
  openArticle(e) {
    wx.navigateTo({ url: '/pages/advanced/article?id=' + e.currentTarget.dataset.id })
  },
  openEndgame(e) {
    wx.navigateTo({ url: '/pages/advanced/endgame?id=' + e.currentTarget.dataset.id })
  },
  openQuiz(e) {
    wx.navigateTo({ url: '/pages/quiz/play?id=' + e.currentTarget.dataset.id })
  }
})
