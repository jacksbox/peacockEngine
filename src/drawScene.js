let cubeRotation = 0.0

const drawScene = (gl, programInfo, buffers, settings, deltaTime = 0, rotationUnit = 0) => {
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

  cubeRotation = rotationUnit
  // TODO remove
  if (settings.rotate) {
    cubeRotation += deltaTime
  }
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0])

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.materials)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
    gl.vertexAttribPointer(programInfo.attribLocations.vertextNormal, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertextNormal)
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program)

  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)

  settings.uniforms.forEach(({ name, loc, texture }) => {
    gl.activeTexture(gl[`TEXTURE${loc}`])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(programInfo.uniformLocations[name], loc)
  })

  {
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, buffers.indexCount, type, offset)
  }
}

export default drawScene
