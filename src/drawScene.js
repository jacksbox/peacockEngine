const lightVector = vec3.fromValues(0, 0, 1)

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
  mat4.translate(modelViewMatrix, modelViewMatrix, settings.translate)

  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, state.move])
  mat4.rotate(modelViewMatrix, modelViewMatrix, state.rotation, [0, 1, 0])

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
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)

  const origin = vec3.fromValues(0.0, 0.0, 0.0)

  vec3.rotateY(lightVector, lightVector, origin, state.deltaTime)
  gl.uniform3fv(programInfo.uniformLocations.lightVector, lightVector)

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
