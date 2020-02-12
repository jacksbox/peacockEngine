const findAdjacentFaces = (v, faces) => {
  const normals = faces.filter(f => f[0].v === v || f[1].v === v || f[2].v === v)
  return normals
}

const calcVectorNormals = (faces, faceNormals) => {
  const normals = []

  const done = []

  faces.forEach(face => {
    face.forEach(vertex => {
      const { v } = vertex
      if (done.includes(v)) {
        return
      }
      done.push(v)
      const adjacentFaces = findAdjacentFaces(v, faces)
      let num = adjacentFaces.length
      let newVN = [
        faceNormals[adjacentFaces[0][0].vn * 3],
        faceNormals[adjacentFaces[0][0].vn * 3 + 1],
        faceNormals[adjacentFaces[0][0].vn * 3 + 2]
      ]
      for (let i = 1; i < num; i += 1) {
        newVN[0] += faceNormals[adjacentFaces[i][0].vn * 3]
        newVN[1] += faceNormals[adjacentFaces[i][0].vn * 3 + 1]
        newVN[2] += faceNormals[adjacentFaces[i][0].vn * 3 + 2]
      }
      newVN = newVN.map(pos => pos / num)
      normals.push(...newVN)
      const vnIndex = normals.length / 3 - 1
      adjacentFaces.forEach(aFace => {
        const index = aFace.find(f => f.v === v)
        index.vn = vnIndex
      })
    })
  })

  return normals
}

export default calcVectorNormals
