import initShaderProgram from './shaders/initShaderProgram'
import objLoader from './objLoader'
import textureLoader from './textureLoader'
import initBuffer from './initBuffer'
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

const startEngine = ({ gl, objData, mtlData, textureData }) => {
  const uniforms = textureData.map((image, i) => {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we can render any size image.
    console.log(image.name)
    if (image.name === 'grass') {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.src)
    const name = `u_image_${i}`
    // const loc = gl.getUniformLocation(shaderProgram, name)
    // gl.uniform1i(loc, image.index)

    // add the texture to the array of textures.
    return { name, loc: i, index: image.index, w: image.src.width, h: image.src.height, url: image.url, texture }
  })

  const shaderProgram = initShaderProgram(gl, uniforms)

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
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      u_image_0: gl.getUniformLocation(shaderProgram, 'u_image_0'),
      u_image_1: gl.getUniformLocation(shaderProgram, 'u_image_1'),
      u_image_2: gl.getUniformLocation(shaderProgram, 'u_image_2'),
      u_image_3: gl.getUniformLocation(shaderProgram, 'u_image_3'),
      u_image_4: gl.getUniformLocation(shaderProgram, 'u_image_4'),
      u_image_5: gl.getUniformLocation(shaderProgram, 'u_image_5')
    }
  }
  uniforms.forEach(({ name }) => {
    programInfo.uniformLocations[name] = gl.getUniformLocation(shaderProgram, name)
  })

  console.log(uniforms)
  console.log(programInfo)

  const buffer = initBuffer(gl, objData)

  settings.uniforms = uniforms

  loop(gl, programInfo, buffer, settings)
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

  console.log({ objData })
  console.log({ mtlData })

  const textureData = await textureLoader({ mtlData, basePath: settings.file.basePath })

  console.log({ textureData })

  startEngine({ gl, objData, mtlData, textureData })
}

window.onload = main
