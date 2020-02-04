import initShaderProgram from './initShaderProgram'
import initBuffer from './initBuffer'
import drawScene from './drawScene'

const main = () => {
  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')

  if (!gl) {
    canvas.replaceWith('Browser does not support WebGL')
    return
  }
  const shaderProgram = initShaderProgram(gl)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    }
  }

  const buffer = initBuffer(gl)

  drawScene(gl, programInfo, buffer)
}

window.onload = main
