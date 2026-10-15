const { note } = require('../../data/rules')
const share = require('../../utils/share')

Page({
  data: {
    note: note
  },
  onShow() {
    share.enable()
  },
  onShareAppMessage() {
    return share.message('掼蛋课堂：规则口径', '/pages/rules/note')
  },
  onShareTimeline() {
    return share.timeline('掼蛋课堂：规则口径')
  }
})
