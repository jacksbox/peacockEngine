import drawScene from './drawScene'

const loop = (gl, programInfo, buffers) => {
  let then = 0

  // Draw the scene repeatedly
  function render(now) {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    drawScene(gl, programInfo, buffers, deltaTime)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
