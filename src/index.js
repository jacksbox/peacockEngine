import initShaderProgram from './shaders/initShaderProgram'
import load from './objLoader/load'
import initBuffer from './initBuffer'
import loop from './loop'

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

  const objData = await load('/resources/Test_2.obj')
  const buffer = initBuffer(gl, objData)

  loop(gl, programInfo, buffer)
}

window.onload = main
