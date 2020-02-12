import rebuildIndex from './rebuildIndex'

const REGEX_USEMTL = /^usemtl\s+(.*)/

const REGEX_POSITIONS = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_TEXTURES = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_NORMALS = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/

const REGEX_FACES_3 = /^f\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}/
const REGEX_FACES_4 = /^f\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}/

const parseVectors = matches =>
  // prettier-ignore
  [
    parseFloat(matches[1]),
    parseFloat(matches[2]),
    parseFloat(matches[3])
  ]

const parseTextures = matches =>
  // prettier-ignore
  [
    parseFloat(matches[1]),
    parseFloat(matches[2])
  ]

const parseIndex = value => (value ? parseInt(value, 10) - 1 : undefined)

const parseFaces3 = matches =>
  // prettier-ignore
  [{
    v: parseIndex(matches[1]),
    vt: parseIndex(matches[2]),
    vn: parseIndex(matches[3])
  },{
    v: parseIndex(matches[4]),
    vt: parseIndex(matches[5]),
    vn: parseIndex(matches[6])
  },{
    v: parseIndex(matches[7]),
    vt: parseIndex(matches[8]),
    vn: parseIndex(matches[9])
  }]

const parseFaces4 = matches =>
  // prettier-ignore
  [[{
    v: parseIndex(matches[1]),
    vt: parseIndex(matches[2]),
    vn: parseIndex(matches[3])
  },{
    v: parseIndex(matches[4]),
    vt: parseIndex(matches[5]),
    vn: parseIndex(matches[6])
  },{
    v: parseIndex(matches[7]),
    vt: parseIndex(matches[8]),
    vn: parseIndex(matches[9])
  }]
  ,[{
    v: parseIndex(matches[1]),
    vt: parseIndex(matches[2]),
    vn: parseIndex(matches[3])
  },{
    v: parseIndex(matches[7]),
    vt: parseIndex(matches[8]),
    vn: parseIndex(matches[9])
  },{
    v: parseIndex(matches[10]),
    vt: parseIndex(matches[11]),
    vn: parseIndex(matches[12])
  }]]

const withMaterial3 = (faces, material) => faces.map(face => ({ ...face, m: material }))
const withMaterial4 = (faces, material) =>
  faces.map(face => {
    const face0 = { m: material, ...face[0] }
    const face1 = { m: material, ...face[1] }
    return [face0, face1]
  })

const parseObj = (text, mtlData = null) => {
  const lines = text.split('\n')

  const positions = []
  const normals = []
  const textures = []
  const faces = []
  const materialTypes = []

  const facesWithMaterial = []

  let currentMaterial = 0
  let matches

  lines.forEach(line => {
    if (mtlData) {
      const [, material] = REGEX_USEMTL.exec(line) || [null, null]
      if (material) {
        const i = materialTypes.indexOf(material)
        if (i > -1) {
          currentMaterial = i
        } else {
          materialTypes.push(material)
          currentMaterial = materialTypes.length - 1
        }
        return
      }
    }
    matches = REGEX_POSITIONS.exec(line)
    if (matches) {
      positions.push(parseVectors(matches))
      return
    }
    matches = REGEX_NORMALS.exec(line)
    if (matches) {
      normals.push(parseVectors(matches))
      return
    }
    matches = REGEX_TEXTURES.exec(line)
    if (matches) {
      textures.push(parseTextures(matches))
      // materials.push(currentMaterial)
      return
    }
    matches = REGEX_FACES_3.exec(line)
    if (matches) {
      const parsedFaces = parseFaces3(matches)
      faces.push(...parsedFaces)
      facesWithMaterial.push(...withMaterial3(parsedFaces, currentMaterial))
    }
    matches = REGEX_FACES_4.exec(line)
    if (matches) {
      const parsedFaces = parseFaces4(matches)
      faces.push(...parsedFaces[0], ...parsedFaces[1])
      const facesWithMaterials = withMaterial4(parsedFaces, currentMaterial)
      facesWithMaterial.push(...facesWithMaterials[0], ...facesWithMaterials[1])
    }
  })

  const computedObjData = rebuildIndex({
    faces: facesWithMaterial,
    positions,
    textures,
    normals
  })

  return computedObjData
}

export default parseObj
