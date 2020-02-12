import calcFaceNormals from './calcFaceNormals'
import calcVectorNormals from './calcVectorNormals'

const getKey = ({ v, vt, vn, m }) => `${v}_${vt}_${vn}_${m}`

const rebuildIndex = ({ faces, positions, textures, normals, vertexNormals }) => {
  const keyToFaceMap = {}

  const maxFaceIndex = faces.length

  let inNormals
  if (!normals.length) {
    const facesCombined = []
    for (let i = 0; i < faces.length; i += 3) {
      facesCombined.push([faces[i], faces[i + 1], faces[i + 2]])
    }
    inNormals = calcFaceNormals(facesCombined, positions, maxFaceIndex)
    console.log({
      facesCombined,
      inNormals
    })
    if (vertexNormals) {
      inNormals = calcVectorNormals(facesCombined, inNormals)
    }
  } else {
    inNormals = normals.reduce((acc, normal) => {
      acc.push(...normal)
      return acc
    }, [])
  }

  const outFaces = []
  const outPositions = []
  const outMaterials = []
  const outNormals = []

  let nextIndex = 0

  faces.forEach(face => {
    const { v, vt, vn, m } = face
    const key = getKey(face)
    const index = keyToFaceMap[key]
    if (typeof index !== 'undefined') {
      outFaces.push(index)
    } else {
      outFaces.push(nextIndex)
      outPositions.push(...positions[v])
      if (typeof vt !== 'undefined') {
        outMaterials.push(...textures[vt], m)
      }
      if (typeof vn !== 'undefined') {
        outNormals.push(inNormals[vn * 3], inNormals[vn * 3 + 1], inNormals[vn * 3 + 2])
      }

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
