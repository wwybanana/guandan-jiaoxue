const { C } = require('../utils/cards')

const quizzes = [
  {
    id: 'rules-check',
    title: '规则快问',
    summary: '八道选择题，核对级牌、炸弹、进贡和接风。',
    questions: [
      {
        id: 'q1',
        stem: '一副掼蛋用多少张牌？每人发到多少？',
        options: [
          { id: 'a', text: '一副 54 张，每人 13 张' },
          { id: 'b', text: '两副 108 张，每人 27 张' },
          { id: 'c', text: '两副 104 张，去掉四张王' }
        ],
        answer: 'b',
        explain: '两副扑克合在一起是 108 张，四个人各 27 张，没有底牌。四张王都留在牌里，凑齐就是天王炸。'
      },
      {
        id: 'q2',
        stem: '打 7 的时候，单张从大到小，紧挨在小王下面的是哪一张？',
        options: [
          { id: 'a', text: 'A' },
          { id: 'b', text: '7' },
          { id: 'c', text: '2' },
          { id: 'd', text: 'K' }
        ],
        answer: 'b',
        explain: '顺序是大王、小王、级牌，然后才是 A。打 7 时，7 从普通队列里抽出来，放在小王下面。'
      },
      {
        id: 'q3',
        stem: '逢人配是哪张牌？',
        options: [
          { id: 'a', text: '任意一张级牌' },
          { id: 'b', text: '红桃级牌，两副牌里共两张' },
          { id: 'c', text: '两张大王' },
          { id: 'd', text: '黑桃 A' }
        ],
        answer: 'b',
        explain: '四个花色的级牌点数一样大，只有红桃级牌能当逢人配。它不能变成王。'
      },
      {
        id: 'q4',
        stem: '同花顺通常压得过哪些炸弹？',
        options: [
          { id: 'a', text: '四张炸弹和五张炸弹' },
          { id: 'b', text: '六张炸弹' },
          { id: 'c', text: '天王炸' },
          { id: 'd', text: '什么都压不过，它只是普通顺子' }
        ],
        answer: 'a',
        explain: '本教程的口径：四炸小于五炸，小于同花顺，小于六炸。同花顺不是普通顺子，但再长的同花也不能当成六炸来打。'
      },
      {
        id: 'q5',
        stem: '头游和二游是同一队，叫双上。升几级？',
        options: [
          { id: 'a', text: '升 1 级' },
          { id: 'b', text: '升 2 级' },
          { id: 'c', text: '升 3 级' }
        ],
        answer: 'c',
        explain: '双上升 3 级，头游配三游升 2 级，头游配末游升 1 级。对手不加级。'
      },
      {
        id: 'q6',
        stem: '一名玩家打完最后一手，其他人都不要。出牌权给谁？',
        options: [
          { id: 'a', text: '下家' },
          { id: 'b', text: '对家，这叫接风' },
          { id: 'c', text: '末游' },
          { id: 'd', text: '重新洗牌' }
        ],
        answer: 'b',
        explain: '这是接风。对家可以任意领出。若对家也已经没牌，再轮到下家。'
      },
      {
        id: 'q7',
        stem: '进贡的一方凑齐两张大王，可以怎么做？',
        options: [
          { id: 'a', text: '必须把两张大王都交出去' },
          { id: 'b', text: '抗贡，这一把不交换牌' },
          { id: 'c', text: '直接升 3 级' }
        ],
        answer: 'b',
        explain: '两张大王可以在同一个人手里，也可以分在队友两人手里。抗贡之后由头游先出；正常还完贡则由末游先出。'
      },
      {
        id: 'q8',
        stem: '顺子里的 A，哪种用法是对的？',
        options: [
          { id: 'a', text: '只能当最大，不能接 2' },
          { id: 'b', text: '可以组成 A2345，也可以组成 10JQKA' },
          { id: 'c', text: '可以组成 K、A、2 这种拐弯顺' }
        ],
        answer: 'b',
        explain: 'A 能当最小，也能当最大。K-A-2 不连续。这个顺序不受级牌影响。'
      }
    ]
  },
  {
    id: 'best-play',
    title: '情景出牌',
    summary: '六道情景，选出更合适的一手，不是只看谁更大。',
    questions: [
      {
        id: 'bp1',
        stem: '级牌是 2。你只剩一对 A，台上是一对 Q。怎么打最好？',
        lead: {
          caption: '台上',
          cards: [C('bp1-q1', 'Q', 'D'), C('bp1-q2', 'Q', 'C')]
        },
        hand: {
          caption: '你只剩',
          cards: [C('bp1-a1', 'A', 'S'), C('bp1-a2', 'A', 'H')]
        },
        options: [
          { id: 'a', text: '出一对 A，直接走完' },
          { id: 'b', text: '拆成单张 A' },
          { id: 'c', text: '不要' }
        ],
        answer: 'a',
        explain: '一对 A 大于一对 Q，而且你出完就没有剩牌。能一次走完，就不要拆，也不要把出牌权让出去。'
      },
      {
        id: 'bp2',
        stem: '级牌是 2。台上是五张顺 6 到 10。你想压过这一轮，同时把炸弹留下来。',
        lead: {
          caption: '台上',
          cards: [
            C('bp2-6', '6', 'S'),
            C('bp2-7', '7', 'H'),
            C('bp2-8', '8', 'D'),
            C('bp2-9', '9', 'C'),
            C('bp2-10', '10', 'S')
          ]
        },
        options: [
          {
            id: 'a',
            text: '出黑桃同花顺 10 到 A',
            cards: [
              C('bp2-a1', '10', 'S'),
              C('bp2-a2', 'J', 'S'),
              C('bp2-a3', 'Q', 'S'),
              C('bp2-a4', 'K', 'S'),
              C('bp2-a5', 'A', 'S')
            ]
          },
          {
            id: 'b',
            text: '出普通顺子 9 到 K',
            cards: [
              C('bp2-b1', '9', 'H'),
              C('bp2-b2', '10', 'D'),
              C('bp2-b3', 'J', 'C'),
              C('bp2-b4', 'Q', 'S'),
              C('bp2-b5', 'K', 'H')
            ]
          },
          { id: 'c', text: '不要' }
        ],
        answer: 'b',
        explain: '两手都是五张时，9 到 K 的最大张是 K，大于台上的 10，按顺子就能压过。同花顺是炸弹，留到后面抢出牌权更值。'
      },
      {
        id: 'bp3',
        stem: '级牌是 5。下面哪手炸弹最大？',
        options: [
          {
            id: 'a',
            text: '四张 A',
            cards: [C('bp3-a1', 'A', 'S'), C('bp3-a2', 'A', 'H'), C('bp3-a3', 'A', 'D'), C('bp3-a4', 'A', 'C')]
          },
          {
            id: 'b',
            text: '五张 4',
            cards: [
              C('bp3-b1', '4', 'S'),
              C('bp3-b2', '4', 'H'),
              C('bp3-b3', '4', 'D'),
              C('bp3-b4', '4', 'C'),
              C('bp3-b5', '4', 'S')
            ]
          },
          {
            id: 'c',
            text: '四张 5，也就是四张级牌',
            cards: [
              C('bp3-c1', '5', 'S', '级'),
              C('bp3-c2', '5', 'H', '级'),
              C('bp3-c3', '5', 'D', '级'),
              C('bp3-c4', '5', 'C', '级')
            ]
          }
        ],
        answer: 'b',
        explain: '炸弹先比张数。五张炸弹大于任何四张炸弹，级牌也不能例外。四张 5 只是这一把最大的四炸。'
      },
      {
        id: 'bp4',
        stem: '对家只剩一张大王，对手两边牌还很多。轮到你领出，你想把上手的机会交给对家。',
        hand: {
          caption: '对家只剩',
          cards: [C('bp4-rj', 'RJ', 'J')]
        },
        options: [
          { id: 'a', text: '领一张小单张' },
          { id: 'b', text: '领一对 7' },
          { id: 'c', text: '领一个五张顺' }
        ],
        answer: 'a',
        explain: '他只能接单张。大王又是最大的单张，中间有人压你的小牌，他多半还能盖回来。对子和顺子他都接不住。'
      },
      {
        id: 'bp5',
        stem: '级牌是 10，红桃 10 是逢人配。你想组成顺子，已有黑桃 7、梅花 8、红桃 9、方片 J。',
        hand: {
          caption: '已有的四张',
          cards: [
            C('bp5-7', '7', 'S'),
            C('bp5-8', '8', 'C'),
            C('bp5-9', '9', 'H'),
            C('bp5-j', 'J', 'D')
          ]
        },
        options: [
          { id: 'a', text: '把逢人配配成 10' },
          { id: 'b', text: '配成 6' },
          { id: 'c', text: '配成大王' }
        ],
        answer: 'a',
        explain: '7、8、9、J 中间缺 10，补上就是 7 到 J。配成 6 之后，J 仍然接不上，不是顺子。逢人配不能当王。'
      },
      {
        id: 'bp6',
        stem: '级牌是 2。台上是三个 8 带一对 4。你想用三带二压过，炸弹先留着。',
        lead: {
          caption: '台上',
          cards: [
            C('bp6-81', '8', 'S'),
            C('bp6-82', '8', 'H'),
            C('bp6-83', '8', 'D'),
            C('bp6-41', '4', 'C'),
            C('bp6-42', '4', 'S')
          ]
        },
        options: [
          { id: 'a', text: '三个 7 带一对 2' },
          { id: 'b', text: '三个 9 带一对 3' },
          { id: 'c', text: '四个 8' }
        ],
        answer: 'b',
        explain: '三带二只比三张。9 大于 8，可以压；7 小于 8，压不住。四个 8 是炸弹，压得住，但这把用三个 9 就够了。'
      }
    ]
  }
]

module.exports = { quizzes: quizzes }
