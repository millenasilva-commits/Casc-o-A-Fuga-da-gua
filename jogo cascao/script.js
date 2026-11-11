let tempo = 0
const LIMITE = 60 // limite em segundos (use 5 para testar rápido)

let cascao = document.getElementById('cascao')
let balde = document.getElementById('balde')
let gameover = document.getElementById('gameover')
let pato = document.getElementById('pato')
let placar = document.getElementById('placar')
let fim = document.getElementById('fim')
let pontos = 0

function pular() {
  cascao.classList.add('pulo')
  setTimeout(function() { cascao.classList.remove('pulo') }, 500)
}

document.addEventListener('keydown', pular)

// o pato volta a aparecer quando reinicia o trajeto
pato.addEventListener('animationiteration', function() {
  pato.classList.remove('coletado')
})

// termina o jogo quando o tempo acaba
function fimDeTempo() {
  clearInterval(contadorTempo)
  clearInterval(coleta)
  clearInterval(colisao)

  balde.style.animationPlayState = 'paused'
  pato.style.animationPlayState = 'paused'
  document.removeEventListener('keydown', pular)

  fim.innerHTML = 'TEMPO ESGOTADO<br>SCORE ' + String(pontos).padStart(3, '0')
  fim.style.visibility = 'visible'
}

// contador de tempo
let contadorTempo = setInterval(function() {
  tempo++
  document.getElementById('contador').innerHTML = 'TIME ' + String(tempo).padStart(3, '0')

  if (tempo >= LIMITE) {
    fimDeTempo()
  }
}, 1000)

// diminui a caixa de colisão (margem de cada lado)
function caixa(el, margem) {
  let r = el.getBoundingClientRect()
  let mx = r.width * margem
  let my = r.height * margem
  return {
    left: r.left + mx,
    right: r.right - mx,
    top: r.top + my,
    bottom: r.bottom - my
  }
}

// coleta do pato
let coleta = setInterval(function() {
  if (pato.classList.contains('coletado')) return

  let a = caixa(cascao, 0.25) // só o centro do Cascão
  let b = caixa(pato, 0.15)   // só o centro do pato

  let encostou = a.left < b.right && a.right > b.left &&
                 a.top < b.bottom && a.bottom > b.top

  if (encostou) {
    pontos++
    placar.innerHTML = 'SCORE ' + String(pontos).padStart(3, '0')
    pato.classList.add('coletado')
  }
}, 10)

// colisão com o balde (game over)
let colisao = setInterval(function() {
  let posBalde = balde.offsetLeft
  let posCascao = parseInt(window.getComputedStyle(cascao).bottom)

  if (posBalde > 0 && posBalde < 120 && posCascao < 165) {
    clearInterval(contadorTempo)
    clearInterval(coleta)

    gameover.style.visibility = 'visible'

    // congela o balde onde ele está
    balde.style.animation = 'none'
    balde.style.left = posBalde + 'px'
    pato.style.animationPlayState = 'paused'
    document.removeEventListener('keydown', pular)

    // "perdeu" do mesmo tamanho do Cascão, em cima do balde
    let larguraPerdeu = cascao.offsetWidth
    cascao.src = 'perdeu.png'
    cascao.style.width = larguraPerdeu + 'px'
    cascao.style.animation = 'none'
    cascao.style.left = (posBalde + (balde.offsetWidth - larguraPerdeu) / 2) + 'px'
    cascao.style.bottom = (70 + balde.offsetHeight - 10) + 'px'

    // Cascão na frente, pato atrás
    cascao.style.zIndex = 60
    pato.style.zIndex = 1

    clearInterval(colisao)
  }
}, 10)