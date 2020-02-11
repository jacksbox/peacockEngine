const degToRad = deg => (deg * Math.PI) / 180

const drawScene = ({ gl, programInfo, buffers, glTextureData, settings, state }) => {
  gl.clearColor(0.3, 0.7, 1.0, 1.0) // Clear to black, fully opaque
  gl.clearDepth(1.0) // Clear everything
  gl.enable(gl.DEPTH_TEST) // Enable depth testing
  gl.depthFunc(gl.LEQUAL) // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const { zFar } = settings
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()
  // move object to initial position
  mat4.translate(modelViewMatrix, modelViewMatrix, settings.translate)

  const cameraMatrix = mat4.create()

  // const viewMatrix = mat4.create()
  // mat4.invert(viewMatrix, cameraMatrix)
  const {
    cameraMod: { position, rotation }
  } = state
  // camera.rZ += (settings.rotate ? state.deltaTime : 0) + rotateZ
  // camera.rX += rotateX

  const angleX = degToRad(rotation.x)
  const angleY = degToRad(rotation.y)
  const angleZ = degToRad(rotation.z)

  const { cos, sin } = Math

  // prettier-ignore
  const rotX = mat4.fromValues(
    1, 0, 0, 0,

    0,
    cos(angleX),
    sin(angleX),
    0,

    0,
    -sin(angleX),
    cos(angleX),
    0,

    0, 0, 0, 1
  )
  // prettier-ignore
  const rotY = mat4.fromValues(
    cos(angleY),
    0,
    -sin(angleY),
    0,

    0, 1, 0, 0,

    sin(angleY),
    0,
    cos(angleY),
    0,

    0, 0, 0, 1
  )

  const rotZ = mat4.fromValues(cos(angleZ), sin(angleZ), 0, 0, -sin(angleZ), cos(angleZ), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  // mat4.rotate(rotX, rotX, degToRad(rotation.x), [1, 0, 0])
  // mat4.rotate(rotY, rotY, degToRad(rotation.y), [0, 1, 0])
  const rot = mat4.create()
  mat4.multiply(rot, rotY, rotX)
  mat4.multiply(rot, rot, rotZ)

  mat4.translate(cameraMatrix, cameraMatrix, [position.x, position.y, position.z])
  mat4.multiply(cameraMatrix, cameraMatrix, rot)
  // mat4.rotate(cameraMatrix, cameraMatrix, degToRad(rotation.y), [0, 1, 0])
  // mat4.rotate(cameraMatrix, cameraMatrix, degToRad(rotation.x), [1, 0, 0])
  // mat4.rotate(cameraMatrix, cameraMatrix, camera.rZ, [0, 1, 0])
  // mat4.invert(cameraMatrix, cameraMatrix)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
  }

  {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.materialBuffer)
    gl.vertexAttribPointer(programInfo.attribLocations.vertextMaterial, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertextMaterial)
  }

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)
  {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer)
    gl.vertexAttribPointer(programInfo.attribLocations.vertextNormal, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertextNormal)
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer)

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program)

  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, cameraMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)

  if (glTextureData) {
    glTextureData.forEach(({ name, id, glTexture }) => {
      gl.activeTexture(gl[`TEXTURE${id}`])
      gl.bindTexture(gl.TEXTURE_2D, glTexture)
      gl.uniform1i(programInfo.uniformLocations[name], id)
    })
  }

  {
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    const { indexCount } = buffers
    gl.drawElements(gl.TRIANGLES, indexCount, type, offset)
  }
}

export default drawScene
