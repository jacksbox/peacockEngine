const initBuffers = (gl, objectData) => {
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectData.positions), gl.STATIC_DRAW)

  const materialBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectData.materials), gl.STATIC_DRAW)

  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectData.normals), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objectData.faces), gl.STATIC_DRAW)

  const indexCount = objectData.facesCount

  return {
    indexBuffer,
    indexCount,
    positionBuffer,
    materialBuffer,
    normalBuffer
  }
}

export default initBuffers
