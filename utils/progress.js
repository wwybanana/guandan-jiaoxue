const KEY = 'guandan_progress_v1'

function empty() {
  return {
    lessons: {},
    articles: {},
    endgames: {},
    quizzes: {}
  }
}

function read() {
  try {
    const data = wx.getStorageSync(KEY)
    if (data && typeof data === 'object') {
      return {
        lessons: data.lessons || {},
        articles: data.articles || {},
        endgames: data.endgames || {},
        quizzes: data.quizzes || {}
      }
    }
  } catch (err) {
    return empty()
  }
  return empty()
}

function write(data) {
  wx.setStorageSync(KEY, data)
}

function mark(bucket, id) {
  const data = read()
  if (!data[bucket]) data[bucket] = {}
  if (!data[bucket][id]) {
    data[bucket][id] = Date.now()
    write(data)
  }
  return data
}

function saveQuiz(id, correct, total) {
  const data = read()
  const prev = data.quizzes[id] || {}
  const best = prev.best || 0
  data.quizzes[id] = {
    best: correct > best ? correct : best,
    last: correct,
    total: total,
    times: (prev.times || 0) + 1,
    updatedAt: Date.now()
  }
  write(data)
  return data.quizzes[id]
}

function reset() {
  const data = empty()
  write(data)
  return data
}

module.exports = {
  read: read,
  mark: mark,
  saveQuiz: saveQuiz,
  reset: reset
}
