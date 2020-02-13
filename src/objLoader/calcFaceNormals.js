const calcFaceNormal = (v1, v2, v3) => {
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

const calcFaceNormals = (faces, positions, max) => {
  const normals = new Array(max * 3)

  faces.forEach((face, index) => {
    const v1 = {
      x: positions[face[0].v][0],
      y: positions[face[0].v][1],
      z: positions[face[0].v][2]
    }
    const v2 = {
      x: positions[face[1].v][0],
      y: positions[face[1].v][1],
      z: positions[face[1].v][2]
    }
    const v3 = {
      x: positions[face[2].v][0],
      y: positions[face[2].v][1],
      z: positions[face[2].v][2]
    }
    const faceNormale = calcFaceNormal(v1, v2, v3)

    for (let j = 0; j < 3; j += 1) {
      face[0 + j].vn = index
      face[0 + j].oVN = index
      normals[index * 3] = faceNormale.x
      normals[index * 3 + 1] = faceNormale.y
      normals[index * 3 + 2] = faceNormale.z
    }
  })

  return normals
}

export default calcFaceNormals
