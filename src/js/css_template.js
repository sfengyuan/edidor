import { randomInt } from './helpers'

// tagged template function, produce wild styles
function styleTemplate (strings, ...keys) {
  return function () {
    let temp = strings.slice()
    keys.forEach((key, i) => {
      temp[i] += gen[key]()
    })
    return temp.join('').replace(/\s{2}/gm, ' ')
  }
}

const gen = {
  darkCode: ['c', 'f', '6', '9'],
  lightCode: ['a', 'b', 'c', 'd', 'e', 'f'],
  textCode: ['1a2a3a', '2a3a4a', '3a4a5a', '4a5a6a', '5a6a7a', '6a7a8a', '7a8a9a'],
  grayCode: ['aaa', 'bbb', 'ccc', 'ddd'],
  lightGrayCode: ['e2e2e2', 'e7e7e7', 'ececec'],
  deepGrayCode: ['222', '333', '444']
}

gen.dark = () => {
  let d = ''
  for (let i = 0; i !== 3; i++) {
    let c = gen.darkCode[randomInt(0, gen.darkCode.length)]
    d += c + c
  }
  return '#' + d
}
gen.light = () => {
  let d = ''
  for (let i = 0; i !== 6; i++) {
    d += gen.lightCode[randomInt(0, gen.lightCode.length)]
  }
  return '#' + d
}

gen.gray = () => {
  let i = randomInt(0, gen.grayCode.length)
  return '#' + gen.grayCode[i]
}
gen.lightGray = () => {
  let i = randomInt(0, gen.lightGrayCode.length)
  return '#' + gen.lightGrayCode[i]
}
gen.deepGray = () => {
  let i = randomInt(0, gen.deepGrayCode.length)
  return '#' + gen.deepGrayCode[i]
}
gen.text = (base = 0, max = 7) => {
  let i = randomInt(base, max)
  return '#' + gen.textCode[i]
}

gen.deepText = gen.text.bind(gen, 0, 2)
gen.mediumText = gen.text.bind(gen, 2, 5)
gen.lightText = gen.text.bind(gen, 5, 6)

const wildStyle = styleTemplate`
  .wild-mode code {
    background: ${'lightGray'}
  }
  .wild-mode .main .article-tags a {
      background: ${'light'};
  }
  .wild-mode .local-info {
      background: ${'light'};
  }
  body.wild-mode,
  .wild-mode .main {
      background: ${'light'};
  }
  .wild-mode th,
  .wild-mode td {
      border-bottom: 1px solid ${'dark'};
  }
  .wild-mode hr {
      border: 1px solid ${'dark'};
  }
  .wild-mode .pagination {
      background: ${'dark'};
  }
  .wild-mode .sidebar {
      background: ${'dark'};
  }
  .wild-mode .header,
  .wild-mode .footer,
  .wild-mode .header .sub-menu li:hover,
  .wild-mode .sidebar a:hover,
  .wild-mode .logo-link,
  .wild-mode .top, .wild-mode .bottom {
      background: ${'dark'};
  }
  .wild-mode .header .menu>li:hover,
  .wild-mode .footer a:hover {
      background: ${'light'};
  }
  .wild-mode .header ul ul {
      box-shadow: 0 0.1em 0.2em 0 ${'dark'};
  }
  .wild-mode .header ul ul,
  .wild-mode .pagination a:hover {
      background: ${'dark'};
  }
  .wild-mode .article-meta,
  .wild-mode .item-meta,
  .wild-mode .footnotes,
  .wild-mode .count,
  .wild-mode .taxonomy-key {
      color: ${'mediumText'};
  }
  .wild-mode .main .article-tags a,
  .wild-mode .local-info,
  .wild-mode .main,
  .wild-mode .main a,
  .wild-mode .terms-list a,
  .wild-mode blockquote.twitter-tweet,
  .wild-mode .sidebar a,
  .wild-mode .taxonomy-key,
  .wild-mode .main .title a,
  .wild-mode .header a,
  .wild-mode .footer a,
  .wild-mode .footer time,
  .wild-mode .pagination a,
  .wild-mode .header .sub-menu a {
      color: ${'deepGray'};
  }
  .wild-mode .icon,
  .wild-mode .footer .icon {
      background: ${'deepGray'};
  }
  `

export default wildStyle
