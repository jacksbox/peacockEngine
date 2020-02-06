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
  return [file.name, image]
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
  const shaderProgram = initShaderProgram(gl, objData)

  // const uniforms = images.map((image, i) => {
  //   const texture = gl.createTexture()
  //   gl.bindTexture(gl.TEXTURE_2D, texture)

  //   // Set the parameters so we can render any size image.
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  //   // Upload the image into the texture.
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image[1])
  //   const name = `u_image_2`
  //   const loc = gl.getUniformLocation(shaderProgram, name)
  //   gl.uniform1i(loc, i)

  //   gl.activeTexture(gl[`TEXTURE${i}`])
  //   gl.bindTexture(gl.TEXTURE_2D, texture)
  //   // add the texture to the array of textures.
  //   return name
  // })
  function powerOfTwo(x) {
    return Math.log2(x) % 1 === 0
  }
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  if (powerOfTwo(images[0][1].width) && powerOfTwo(images[0][1].height)) {
    // Yes, it's a power of 2. Generate mips.
    gl.generateMipmap(gl.TEXTURE_2D)
  } else {
    // No, it's not a power of 2. Turn off mips and set
    // wrapping to clamp to edge
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[0][1])
  // const loc = gl.getUniformLocation(shaderProgram, `u_image_2`)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertextMaterial: gl.getAttribLocation(shaderProgram, 'aVertextMaterial'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      u_image_2: gl.getUniformLocation(shaderProgram, 'u_image_2')
    }
  }
  // uniforms.forEach(name => {
  //   programInfo.uniformLocations[name] = gl.getUniformLocation(shaderProgram, name)
  // })

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(programInfo.uniformLocations.u_image_2, 0)

  console.log(programInfo)

  const buffer = initBuffer(gl, objData)

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

  const files = Object.keys(objData.mtlData).reduce((acc, name) => {
    if (objData.mtlData[name].file) {
      acc.push({ url: objData.mtlData[name].file, name })
    }
    return acc
  }, [])

  console.log('files loaded', files)

  loadImages(files, startEngine(gl, objData))
}

window.onload = main
