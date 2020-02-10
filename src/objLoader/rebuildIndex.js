const getKey = ({ v, vt, vn, m }) => `${v}_${vt}_${vn}_${m}`

const rebuildIndex = ({ faces, positions, textures, normals }) => {
  const keyToFaceMap = {}

  const outFaces = []
  const outPositions = []
  const outMaterials = []
  const outNormals = []

  let nextIndex = 0
  faces.forEach((face, i) => {
    const { v, vt, vn, m } = face
    const key = getKey(face)
    const index = keyToFaceMap[key]
    if (typeof index !== 'undefined') {
      outFaces.push(index)
    } else {
      outFaces.push(nextIndex)
      outPositions.push(...positions[v])
      outMaterials.push(...textures[vt], m)
      outNormals.push(...normals[vn])

      keyToFaceMap[key] = nextIndex
      nextIndex += 1
    }
  })

  const outfacesCount = outFaces.length

  return {
    faces: outFaces,
    facesCount: outfacesCount,
    positions: outPositions,
    materials: outMaterials,
    normals: outNormals
  }
}

export default rebuildIndex
