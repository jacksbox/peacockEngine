const calcNormaleForFace = (v1, v2, v3) => {
  const u = {
    x: v2.x - v1.x,
    y: v2.y - v1.y,
    z: v2.z - v1.z
  }
  const v = {
    x: v3.x - v1.x,
    y: v3.y - v1.y,
    z: v3.z - v1.z
  }
  const n = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x
  }
  let len = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)
  if (len === 0) {
    len = 1
  }

  return {
    x: n.x / len,
    y: n.y / len,
    z: n.z / len
  }
}

const calcNormals = (faces, positions, max) => {
  const normals = new Array(max * 3)

  for (let i = 0; i < faces.length; i += 3) {
    const v1 = {
      x: positions[faces[i] * 3],
      y: positions[faces[i] * 3 + 1],
      z: positions[faces[i] * 3 + 2]
    }
    const v2 = {
      x: positions[faces[i + 1] * 3],
      y: positions[faces[i + 1] * 3 + 1],
      z: positions[faces[i + 1] * 3 + 2]
    }
    const v3 = {
      x: positions[faces[i + 2] * 3],
      y: positions[faces[i + 2] * 3 + 1],
      z: positions[faces[i + 2] * 3 + 2]
    }
    const faceNormale = calcNormaleForFace(v1, v2, v3)

    for (let j = 0; j < 3; j += 1) {
      normals[faces[i + j] * 3] = faceNormale.x
      normals[faces[i + j] * 3 + 1] = faceNormale.y
      normals[faces[i + j] * 3 + 2] = faceNormale.z
    }
  }
  return normals
}

export default calcNormals
