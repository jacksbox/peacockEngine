import initShaderProgram from './shaders/initShaderProgram'
import objLoader from './objLoader'
import textureLoader from './textureLoader'
import bindTextures from './bindTextures'
import initBuffer from './initBuffer'
import drawScene from './drawScene'
import loop from './loop'

const settingsDeer = {
  file: {
    basePath: 'resources',
    filename: 'deer.obj'
  },
  zFar: 10000,
  translate: [-0.0, -500.0, -5000.0],
  rotate: true
}

const settingsPeacock1 = {
  file: {
    basePath: 'resources',
    filename: 'Peacock_1.obj'
  },
  zFar: 10000,
  translate: [-0.0, -2.0, -5.0],
  rotate: false
}

const settingsPeacock2 = {
  file: {
    basePath: 'resources',
    filename: 'Peacock_2.obj'
  },
  zFar: 10000,
  translate: [-0.0, -2.0, -10.0],
  rotate: true
}

const settingsPeacockWorld = {
  file: {
    basePath: 'resources',
    filename: 'Peacock_World4.obj'
  },
  zFar: 800,
  translate: [0, -50.0, -200.0],
  rotate: false
}

const settings = settingsPeacockWorld

const start = ({ gl, objData, textureData }) => {
  const glTextureData = bindTextures(gl, textureData)

  // TEXTURES LOADED
  console.log({ glTextureData })

  const shaderProgram = initShaderProgram(gl, glTextureData)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertextMaterial: gl.getAttribLocation(shaderProgram, 'aVertextMaterial'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix')
    }
  }

  glTextureData.forEach(texture => {
    programInfo.uniformLocations[texture.name] = gl.getUniformLocation(shaderProgram, texture.name)
  })

  // PROGRAM INFO DONE
  console.log({ programInfo })

  const buffers = initBuffer(gl, objData)

  const draw = state =>
    drawScene({
      gl,
      programInfo,
      buffers,
      glTextureData,
      settings,
      state
    })

  loop(draw)
}

const initGl = canvasElementId => {
  const canvas = document.getElementById(canvasElementId)
  const gl = canvas.getContext('webgl')

  if (!gl) {
    canvas.replaceWith('Browser does not support WebGL')
    return null
  }

  return gl
}

const main = async () => {
  const gl = initGl('canvas')
  if (!gl) {
    return
  }

  const { objData, mtlData } = await objLoader({ ...settings.file })

  // OBJ & MTL PARSED
  console.log({ objData })
  console.log({ mtlData })

  const textureData = await textureLoader({ mtlData, basePath: settings.file.basePath })

  // TEXTURE FILES LOADED
  console.log({ textureData })

  start({ gl, objData, textureData })
}

window.onload = main
