function C(id, rank, suit, badge, asRank) {
  return {
    id: id,
    rank: rank,
    suit: suit,
    wild: badge === '配',
    badge: badge || '',
    asRank: asRank || ''
  }
}

module.exports = { C }
