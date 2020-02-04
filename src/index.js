import initShaderProgram from './initShaderProgram'
import initBuffer from './initBuffer'
import loadObjectFile from './loadObjectFile'
import loop from './loop'
import drawScene from './drawScene'

const main = async () => {
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

  const objectData = await loadObjectFile('/resources/Peacock.obj')
  const buffer = initBuffer(gl, objectData)
  // drawScene(gl, programInfo, buffer, objectData.vCount)
  loop(gl, programInfo, buffer, objectData.vCount)
}

window.onload = main
