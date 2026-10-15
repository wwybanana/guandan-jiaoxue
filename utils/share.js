function enable() {
  wx.showShareMenu({
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

function message(title, path) {
  return {
    title: title,
    path: path
  }
}

function timeline(title, query) {
  const card = { title: title }
  if (query) card.query = query
  return card
}

module.exports = {
  enable: enable,
  message: message,
  timeline: timeline
}
