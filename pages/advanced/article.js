const { articles } = require('../../data/articles')
const progress = require('../../utils/progress')
const share = require('../../utils/share')

function findArticle(id) {
  for (let i = 0; i < articles.length; i += 1) {
    if (articles[i].id === id) return { article: articles[i], index: i }
  }
  return null
}

Page({
  data: {
    article: null,
    missing: false,
    prevId: '',
    nextId: ''
  },
  onShow() {
    share.enable()
  },
  onLoad(query) {
    const found = findArticle(query.id)
    if (!found) {
      this.setData({ missing: true })
      return
    }
    progress.mark('articles', found.article.id)
    const prev = found.index > 0 ? articles[found.index - 1] : null
    const next = found.index < articles.length - 1 ? articles[found.index + 1] : null
    wx.setNavigationBarTitle({ title: found.article.title })
    this.setData({
      article: found.article,
      prevId: prev ? prev.id : '',
      nextId: next ? next.id : ''
    })
  },
  goPrev() {
    if (!this.data.prevId) return
    wx.redirectTo({ url: '/pages/advanced/article?id=' + this.data.prevId })
  },
  goNext() {
    if (!this.data.nextId) {
      wx.navigateBack({ delta: 1 })
      return
    }
    wx.redirectTo({ url: '/pages/advanced/article?id=' + this.data.nextId })
  },
  back() {
    wx.navigateBack({
      fail() {
        wx.switchTab({ url: '/pages/advanced/index' })
      }
    })
  },
  onShareAppMessage() {
    const article = this.data.article
    if (!article) return share.message('掼蛋课堂：会认牌之后，练怎么出', '/pages/advanced/index')
    return share.message('掼蛋课堂：' + article.title, '/pages/advanced/article?id=' + article.id)
  },
  onShareTimeline() {
    const article = this.data.article
    if (!article) return share.timeline('掼蛋课堂：会认牌之后，练怎么出')
    return share.timeline('掼蛋课堂：' + article.title, 'id=' + article.id)
  }
})
