const { quizzes } = require('../../data/quizzes')
const progress = require('../../utils/progress')
const share = require('../../utils/share')

function findQuiz(id) {
  for (let i = 0; i < quizzes.length; i += 1) {
    if (quizzes[i].id === id) return quizzes[i]
  }
  return null
}

function comment(correct, total) {
  if (!total) return ''
  if (correct === total) return '全部答对。这套口径可以拿去上桌了。'
  if (correct * 5 >= total * 4) return '已经比较稳。错的几题，回规则课对一下级牌和炸弹。'
  if (correct * 5 >= total * 3) return '大框架有了。建议把「牌型与大小」和「级牌与逢人配」再看一遍。'
  return '先别急着记牌。回规则学习把级牌、炸弹和接风过一遍，再来一次。'
}

Page({
  data: {
    quiz: null,
    missing: false,
    phase: 'play',
    cursor: 0,
    total: 0,
    current: null,
    picked: '',
    locked: false,
    correctCount: 0,
    letters: ['A', 'B', 'C', 'D', 'E'],
    record: null,
    comment: ''
  },
  onShow() {
    share.enable()
  },
  onLoad(query) {
    const quiz = findQuiz(query.id)
    if (!quiz) {
      this.setData({ missing: true })
      return
    }
    wx.setNavigationBarTitle({ title: quiz.title })
    this.setData({
      quiz: quiz,
      total: quiz.questions.length,
      current: quiz.questions[0],
      cursor: 0
    })
  },
  pick(e) {
    if (this.data.locked) return
    const picked = e.currentTarget.dataset.opt
    if (!picked) return
    this.setData({ picked: picked })
  },
  confirm() {
    if (this.data.locked || !this.data.picked) return
    const ok = this.data.picked === this.data.current.answer
    this.setData({
      locked: true,
      correctCount: this.data.correctCount + (ok ? 1 : 0)
    })
  },
  next() {
    const cursor = this.data.cursor + 1
    if (cursor >= this.data.total) {
      this.finish()
      return
    }
    this.setData({
      cursor: cursor,
      current: this.data.quiz.questions[cursor],
      picked: '',
      locked: false
    })
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },
  finish() {
    const record = progress.saveQuiz(this.data.quiz.id, this.data.correctCount, this.data.total)
    this.setData({
      phase: 'result',
      record: record,
      comment: comment(this.data.correctCount, this.data.total)
    })
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },
  retry() {
    this.setData({
      phase: 'play',
      cursor: 0,
      current: this.data.quiz.questions[0],
      picked: '',
      locked: false,
      correctCount: 0,
      record: null,
      comment: ''
    })
  },
  back() {
    wx.navigateBack({
      fail() {
        wx.switchTab({ url: '/pages/advanced/index' })
      }
    })
  },
  onShareAppMessage() {
    const quiz = this.data.quiz
    if (!quiz) return share.message('掼蛋课堂：会认牌之后，练怎么出', '/pages/advanced/index')
    return share.message('掼蛋课堂：' + quiz.title, '/pages/quiz/play?id=' + quiz.id)
  },
  onShareTimeline() {
    const quiz = this.data.quiz
    if (!quiz) return share.timeline('掼蛋课堂：会认牌之后，练怎么出')
    return share.timeline('掼蛋课堂：' + quiz.title, 'id=' + quiz.id)
  }
})
