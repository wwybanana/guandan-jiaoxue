const { C } = require('./cards')

const LEVELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const HIGH_TO_LOW = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']

function rankStrip(level) {
  const cards = [
    C('rj', 'RJ', 'J'),
    C('bj', 'BJ', 'J'),
    C('lv', level, 'H', '配')
  ]
  HIGH_TO_LOW.forEach((rank, index) => {
    if (rank === level) return
    const suit = index % 2 === 0 ? 'S' : 'D'
    cards.push(C('r-' + rank, rank, suit))
  })
  return cards
}

function rankHint(level, rank) {
  if (rank === 'RJ') return '大王。单张里最大，压过小王和级牌。'
  if (rank === 'BJ') return '小王。小于大王，大于这一把的级牌。'
  if (rank === level) {
    return '级牌 ' + level + '。四门花色点数相同，都比 A 大。红桃 ' + level + ' 兼任逢人配；单张打出时只算级牌，不会变成别的牌。'
  }
  if (rank === '2') return '2。只要它不是级牌，就是最小的点数。'
  if (rank === 'A') return 'A。除了王和级牌，它是最大的普通点数。组顺子时也可以当最小，接成 A2345。'
  return rank + '。普通点数，按 A 大、2 小来比。级牌不排在这个位置。'
}

module.exports = {
  LEVELS: LEVELS,
  rankStrip: rankStrip,
  rankHint: rankHint
}
