const loop = draw => {
  let then = 0

  let rotation = 0
  let move = 0

  document.addEventListener('keydown', event => {
    if (event.isComposing) {
      return
    }

    if (event.keyCode === 37) {
      // LEFT
      rotation -= 0.1
    } else if (event.keyCode === 39) {
      // RIGHT
      rotation += 0.1
    }
    if (event.keyCode === 38) {
      // LEFT
      move += 10
    } else if (event.keyCode === 40) {
      // RIGHT
      move -= 10
    }
  })

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    draw({ deltaTime, rotation, move })

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
