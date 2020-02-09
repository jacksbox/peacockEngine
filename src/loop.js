import drawScene from './drawScene'

const loop = (gl, programInfo, buffers, settings) => {
  let then = 0

  let rotationUnit = 0
  document.addEventListener('keydown', event => {
    if (event.isComposing) {
      return
    } else if (event.keyCode === 37) {
      rotationUnit -= 0.1
    } else if (event.keyCode === 39) {
      rotationUnit += 0.1
    }
  })

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    drawScene(gl, programInfo, buffers, settings, deltaTime, rotationUnit)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
