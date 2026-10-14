Component({
  options: {
    virtualHost: true
  },
  properties: {
    cards: { type: Array, value: [] },
    size: { type: String, value: 'md' },
    nowrap: { type: Boolean, value: false },
    tappable: { type: Boolean, value: false }
  },
  methods: {
    onCardTap: function (e) {
      if (!this.data.tappable) return
      this.triggerEvent('cardtap', e.detail || {})
    }
  }
})
