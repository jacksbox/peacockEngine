import initShaderProgram from './shaders/initShaderProgram'
import objLoader from './objLoader'
import textureLoader from './textureLoader'
import bindTextures from './bindTextures'
import initBuffer from './initBuffer'
import drawScene from './drawScene'
import loop from './loop'

const settingsDeerCalcNormalsFace = {
  queryParam: 'faceNormals',
  file: {
    basePath: 'resources',
    filename: 'deer_no_normals.obj'
  },
  zFar: 10000,
  translate: [-0.0, -500.0, -3000.0],
  rotate: true
}

const settingsDeerCalcNormalsVertex = {
  queryParam: 'vertexNormals',
  file: {
    basePath: 'resources',
    filename: 'deer_no_normals.obj'
  },
  zFar: 10000,
  translate: [-0.0, -500.0, -3000.0],
  rotate: true,
  vertexNormals: true
}

const settingsDeer = {
  queryParam: 'color',
  file: {
    basePath: 'resources',
    filename: 'deer.obj'
  },
  zFar: 10000,
  translate: [-0.0, -500.0, -3000.0],
  rotate: true
}

const settingsPeacockWorld = {
  queryParam: 'peacock',
  file: {
    basePath: 'resources',
    filename: 'Peacock_World4.obj'
  },
  zFar: 800,
  translate: [0, -50.0, -200.0],
  rotate: false
}

const availableSettings = [
  settingsPeacockWorld,
  settingsDeer,
  settingsDeerCalcNormalsVertex,
  settingsDeerCalcNormalsFace
]

const start = ({ gl, objData, textureData, settings }) => {
  const glTextureData = textureData ? bindTextures(gl, textureData) : null

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
      viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      lightVector: gl.getUniformLocation(shaderProgram, 'ulightVector')
    }
  }

  if (glTextureData) {
    glTextureData.forEach(texture => {
      programInfo.uniformLocations[texture.name] = gl.getUniformLocation(shaderProgram, texture.name)
    })
  }

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
  const params = new URLSearchParams(window.location.search)
  const model = params.get('m')
  const settings = availableSettings.find(setting => setting.queryParam === model) || availableSettings[0]

  const gl = initGl('canvas')
  if (!gl) {
    return
  }

  const { objData, mtlData } = await objLoader({ ...settings.file, vertexNormals: settings.vertexNormals })

  // OBJ & MTL PARSED
  console.log({ objData })
  console.log({ mtlData })

  const textureData = mtlData ? await textureLoader({ mtlData, basePath: settings.file.basePath }) : null

  // TEXTURE FILES LOADED
  console.log({ textureData })

  start({ gl, objData, textureData, settings })
}

window.onload = main
