App({
  onLaunch() {
    try {
      const saved = wx.getStorageSync('guandan_progress_v1')
      if (!saved) {
        wx.setStorageSync('guandan_progress_v1', {
          lessons: {},
          articles: {},
          endgames: {},
          quizzes: {}
        })
      }
    } catch (err) {
      // Preview can occasionally block storage; pages treat that as empty progress.
    }
  }
})
