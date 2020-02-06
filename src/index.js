import initShaderProgram from './shaders/initShaderProgram'
import load from './objLoader/load'
import initBuffer from './initBuffer'
import loop from './loop'

const settingsDeer = {
  objFile: 'deer.obj',
  zFar: 10000,
  translate: [-0.0, -500.0, -5000.0],
  rotate: true
}

const settingsPeacock2 = {
  objFile: 'Peacock_2.obj',
  zFar: 10000,
  translate: [-0.0, -2.0, -10.0],
  rotate: true
}

const settingsPeacockWorld = {
  objFile: 'Peacock_World.obj',
  zFar: 10000,
  translate: [50.0, -60.0, -300.0],
  rotate: false
}

const settings = settingsPeacockWorld

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
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
      // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    }
  }

  const objData = await load('resources', settings.objFile)
  const buffer = initBuffer(gl, objData)

  loop(gl, programInfo, buffer, settings)
}

window.onload = main
