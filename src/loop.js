const loop = draw => {
  let then = 0

  let rotateZ = 0
  let rotateX = 0
  let moveStraight = 0
  let moveSide = 0

  const cameraMod = {
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  }

  document.addEventListener('keydown', event => {
    if (event.isComposing) {
      return
    }

    if (event.keyCode === 37) {
      // LEFT
    } else if (event.keyCode === 39) {
      // RIGHT
    } else if (event.keyCode === 38) {
      // UP
      cameraMod.rotation.x -= 10
    } else if (event.keyCode === 40) {
      // DOWN
      cameraMod.rotation.x += 10
    }
    if (event.keyCode === 87) {
      // W
      cameraMod.position.z += 10
    } else if (event.keyCode === 65) {
      // A
      cameraMod.rotation.y -= 10
    } else if (event.keyCode === 83) {
      // S
      cameraMod.position.z -= 10
    } else if (event.keyCode === 68) {
      // D
      cameraMod.rotation.y += 10
    }
  })

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    draw({ deltaTime, cameraMod })

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
