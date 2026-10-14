Component({
  options: {
    virtualHost: true
  },
  properties: {
    rank: { type: String, value: '' },
    suit: { type: String, value: '' },
    wild: { type: Boolean, value: false },
    badge: { type: String, value: '' },
    asRank: { type: String, value: '' },
    size: { type: String, value: 'md' },
    dim: { type: Boolean, value: false },
    tappable: { type: Boolean, value: false }
  },
  data: {
    symbol: '',
    red: false,
    joker: false,
    big: false,
    label: '',
    longRank: false
  },
  observers: {
    'rank, suit': function (rank, suit) {
      this.sync(rank, suit)
    }
  },
  lifetimes: {
    attached: function () {
      this.sync(this.data.rank, this.data.suit)
    }
  },
  methods: {
    sync: function (rank, suit) {
      const joker = rank === 'BJ' || rank === 'RJ' || suit === 'J'
      const red = suit === 'H' || suit === 'D' || rank === 'RJ'
      const symbols = { S: '♠', H: '♥', D: '♦', C: '♣' }
      this.setData({
        symbol: symbols[suit] || '',
        red: red,
        joker: joker,
        big: rank === 'RJ',
        label: rank === 'BJ' ? '小王' : rank === 'RJ' ? '大王' : rank,
        longRank: rank === '10'
      })
    },
    onTap: function () {
      this.triggerEvent('cardtap', {
        rank: this.data.rank,
        suit: this.data.suit,
        badge: this.data.badge || ''
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})
