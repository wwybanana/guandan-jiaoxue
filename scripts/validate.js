const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const errors = []

function readJSON(rel) {
  const full = path.join(root, rel)
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'))
  } catch (err) {
    errors.push(rel + ' is not valid JSON: ' + err.message)
    return null
  }
}

const RANKS = { A: 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1, J: 1, Q: 1, K: 1, BJ: 1, RJ: 1 }
const SUITS = { S: 1, H: 1, D: 1, C: 1, J: 1 }
const BLOCKS = { h2: 1, p: 1, note: 1, tip: 1, cards: 1, compare: 1, gallery: 1, steps: 1, table: 1, seats: 1, level: 1, track: 1 }

function checkCards(cards, where) {
  if (!Array.isArray(cards) || !cards.length) {
    errors.push(where + ' needs cards')
    return
  }
  const seen = {}
  cards.forEach((card) => {
    if (!card || !RANKS[card.rank]) errors.push(where + ' bad rank ' + (card && card.rank))
    if (!card || !SUITS[card.suit]) errors.push(where + ' bad suit')
    if (card && (card.rank === 'BJ' || card.rank === 'RJ') && card.suit !== 'J') {
      errors.push(where + ' joker suit')
    }
    if (card && seen[card.id]) errors.push(where + ' duplicate card id ' + card.id)
    if (card) seen[card.id] = true
    if (card && card.badge === '配' && !card.wild) errors.push(where + ' wild flag')
    if (card && card.asRank && !RANKS[card.asRank]) errors.push(where + ' bad asRank')
  })
}

const app = readJSON('app.json')
const project = readJSON('project.config.json')
readJSON('sitemap.json')

if (project && project.appid !== 'wxfd17bb26e9716ca4') errors.push('appid should be wxfd17bb26e9716ca4')
if (project && project.projectname !== '掼蛋课堂') errors.push('projectname should be 掼蛋课堂')
if (project && project.compileType !== 'miniprogram') errors.push('compileType')

if (app) {
  app.pages.forEach((page) => {
    ;['.js', '.json', '.wxml', '.wxss'].forEach((ext) => {
      if (!fs.existsSync(path.join(root, page + ext))) errors.push('missing ' + page + ext)
    })
    readJSON(page + '.json')
  })
  const tabPages = {}
  app.pages.forEach((page) => {
    tabPages[page] = true
  })
  app.tabBar.list.forEach((item) => {
    if (!tabPages[item.pagePath]) errors.push('tab page missing ' + item.pagePath)
    ;[item.iconPath, item.selectedIconPath].forEach((icon) => {
      if (!fs.existsSync(path.join(root, icon))) errors.push('missing icon ' + icon)
    })
  })
  if (!app.usingComponents['card-row'] || !app.usingComponents['poker-card']) {
    errors.push('global card components missing')
  }
}

;['components/poker-card', 'components/card-row'].forEach((dir) => {
  ;['.js', '.json', '.wxml', '.wxss'].forEach((ext) => {
    const rel = dir + '/index' + ext
    if (!fs.existsSync(path.join(root, rel))) errors.push('missing ' + rel)
  })
})

const { lessons } = require('../data/lessons')
const { articles } = require('../data/articles')
const { endgames } = require('../data/endgames')
const { quizzes } = require('../data/quizzes')
const { note } = require('../data/rules')
const { rankStrip, LEVELS } = require('../utils/ranks')

function unique(list, label) {
  const seen = {}
  list.forEach((item) => {
    if (seen[item.id]) errors.push('duplicate ' + label + ' ' + item.id)
    seen[item.id] = true
  })
}

unique(lessons, 'lesson')
unique(articles, 'article')
unique(endgames, 'endgame')
unique(quizzes, 'quiz')

if (lessons.length < 6) errors.push('need 6 lessons')
if (articles.length < 5) errors.push('need 5 articles')
if (endgames.length < 9) errors.push('need 9 endgames')

const levels = { 初级: 0, 中级: 0, 高级: 0 }
endgames.forEach((item) => {
  if (!levels.hasOwnProperty(item.level)) errors.push('bad endgame level ' + item.level)
  else levels[item.level] += 1
  if (!item.options || item.options.length < 2) errors.push(item.id + ' options')
  const ids = {}
  item.options.forEach((opt) => {
    ids[opt.id] = true
  })
  if (!ids[item.answer]) errors.push(item.id + ' answer missing')
  ;(item.groups || []).forEach((group, index) => {
    checkCards(group.cards, item.id + ' group ' + index)
  })
})
;['初级', '中级', '高级'].forEach((level) => {
  if (levels[level] < 2) errors.push(level + ' needs at least 2')
})

lessons.forEach((lesson) => {
  if (!lesson.blocks || !lesson.blocks.length) errors.push(lesson.id + ' empty')
  lesson.blocks.forEach((block) => {
    if (!BLOCKS[block.type]) errors.push(lesson.id + ' bad block ' + block.type)
    if (block.type === 'cards') checkCards(block.cards, lesson.id + ' ' + block.id)
    if (block.type === 'compare') {
      checkCards(block.left.cards, block.id + ' left')
      checkCards(block.right.cards, block.id + ' right')
      if (block.answer !== 'left' && block.answer !== 'right') errors.push(block.id + ' answer')
    }
    if (block.type === 'gallery') {
      block.items.forEach((item) => checkCards(item.cards, block.id + ' ' + item.id))
    }
  })
})

articles.forEach((article) => {
  article.blocks.forEach((block) => {
    if (block.type === 'cards') checkCards(block.cards, article.id + ' ' + block.id)
  })
})

if (quizzes.length < 2) errors.push('need 2 quizzes')
quizzes.forEach((quiz) => {
  if (quiz.questions.length < 4) errors.push(quiz.id + ' too short')
  quiz.questions.forEach((question) => {
    const ids = {}
    question.options.forEach((opt) => {
      ids[opt.id] = true
      if (opt.cards) checkCards(opt.cards, question.id)
    })
    if (!ids[question.answer]) errors.push(question.id + ' answer')
    if (question.lead) checkCards(question.lead.cards, question.id + ' lead')
    if (question.hand) checkCards(question.hand.cards, question.id + ' hand')
  })
})

if (!note.items || note.items.length < 8) errors.push('rule note too short')

function ranksOf(level) {
  return rankStrip(level).map((card) => card.rank).join(',')
}

const expect2 = 'RJ,BJ,2,A,K,Q,J,10,9,8,7,6,5,4,3'
const expect5 = 'RJ,BJ,5,A,K,Q,J,10,9,8,7,6,4,3,2'
const expectA = 'RJ,BJ,A,K,Q,J,10,9,8,7,6,5,4,3,2'
if (ranksOf('2') !== expect2) errors.push('rank strip 2: ' + ranksOf('2'))
if (ranksOf('5') !== expect5) errors.push('rank strip 5: ' + ranksOf('5'))
if (ranksOf('A') !== expectA) errors.push('rank strip A: ' + ranksOf('A'))
if (LEVELS.length !== 13) errors.push('levels')
const wild = rankStrip('10').filter((card) => card.wild)
if (wild.length !== 1 || wild[0].rank !== '10' || wild[0].suit !== 'H') errors.push('wild card')

function walk(dir) {
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      if (name === 'scripts' || name === 'node_modules' || name === '.git') return
      walk(full)
      return
    }
    if (name.endsWith('.js')) {
      const rel = path.relative(root, full)
      try {
        require('child_process').execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' })
      } catch (err) {
        errors.push('syntax ' + rel)
      }
    }
  })
}

walk(root)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const quizCount = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)
console.log('ok lessons=' + lessons.length + ' articles=' + articles.length + ' endgames=' + endgames.length + ' questions=' + quizCount)
