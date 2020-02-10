const loop = draw => {
  let then = 0

  let rotateZ = 0
  let rotateX = 0
  document.addEventListener('keydown', event => {
    if (event.isComposing) {
      return
    }

    if (event.keyCode === 37) {
      rotateZ -= 0.1
    } else if (event.keyCode === 39) {
      rotateZ += 0.1
    } else if (event.keyCode === 38) {
      rotateX += 0.1
    } else if (event.keyCode === 40) {
      rotateX -= 0.1
    }
  })

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    draw({ deltaTime, rotateZ, rotateX })

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
