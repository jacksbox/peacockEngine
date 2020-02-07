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

const loadImage = (file, callback) => {
  const image = new Image()
  image.src = 'resources/' + file.url
  image.onload = callback
  return { name: file.name, src: image, index: file.i }
}

const loadImages = (files, callback) => {
  let images = []
  let imagesToLoad = files.length

  // Called each time an image finished loading.
  const onImageLoad = () => {
    imagesToLoad -= 1
    // If all the images are loaded call the callback.
    if (imagesToLoad === 0) {
      callback(images)
    }
  }

  images = files.map(file => loadImage(file, onImageLoad))
}

const startEngine = (gl, objData) => images => {
  const uniforms = images.map((image, i) => {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.src)
    const name = `u_image_${i}`
    // const loc = gl.getUniformLocation(shaderProgram, name)
    // gl.uniform1i(loc, image.index)

    gl.activeTexture(gl[`TEXTURE${i}`])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // add the texture to the array of textures.
    return { name, loc: i, index: image.index, w: image.src.width, h: image.src.height }
  })

  const shaderProgram = initShaderProgram(gl, uniforms)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertextMaterial: gl.getAttribLocation(shaderProgram, 'aVertextMaterial')
      // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
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

  console.log(programInfo)

  const buffer = initBuffer(gl, objData)

  settings.uniforms = uniforms

  loop(gl, programInfo, buffer, settings)
}

const main = async () => {
  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')

  if (!gl) {
    canvas.replaceWith('Browser does not support WebGL')
    return
  }

  const objData = await load('resources', settings.objFile)

  console.log('obj parsed', objData)

  const files = Object.keys(objData.mtlData).reduce((acc, name, i) => {
    if (objData.mtlData[name].file) {
      acc.push({ url: objData.mtlData[name].file, name, i })
    }
    return acc
  }, [])

  console.log('files loaded', files)

  loadImages(files, startEngine(gl, objData))
}

window.onload = main
