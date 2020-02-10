const loop = draw => {
  let then = 0

  let rotateZ = 0
  let rotateX = 0
  let moveStraight = 0
  let moveSide = 0
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
    if (event.keyCode === 87) {
      moveStraight += 10
    } else if (event.keyCode === 65) {
      moveSide += 10
    } else if (event.keyCode === 83) {
      moveStraight -= 10
    } else if (event.keyCode === 68) {
      moveSide -= 10
    }
  })

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    draw({ deltaTime, rotateZ, rotateX, moveStraight, moveSide })

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
