import drawScene from './drawScene'

const loop = (gl, programInfo, buffers, settings) => {
  let then = 0

  const render = now => {
    const nowS = now * 0.001 // convert to seconds
    const deltaTime = nowS - then
    then = nowS

    drawScene(gl, programInfo, buffers, settings, deltaTime)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export default loop
