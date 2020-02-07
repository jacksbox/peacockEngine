const REGEX_POSITIONS = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_NORMALES = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_TEXTURES = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_FACES = /^f\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}\s+(\d+)\/(\d+)\/{0,1}(\d*){0,1}/
const REGEX_USEMTL = /^usemtl\s+(.*)/

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

const parseFaces = matches =>
  // prettier-ignore
  [{
    v: parseInt(matches[1], 10) - 1,
    vt: parseInt(matches[2], 10) - 1,
    vn: parseInt(matches[3], 10) - 1
  },{
    v: parseInt(matches[4], 10) - 1,
    vt: parseInt(matches[5], 10) - 1,
    vn: parseInt(matches[6], 10) - 1
  },{
    v: parseInt(matches[7], 10) - 1,
    vt: parseInt(matches[8], 10) - 1,
    vn: parseInt(matches[9], 10) - 1
  }]

const parseObj = (text, mtlData = null) => {
  const lines = text.split('\n')

  const positions = []
  const normales = []
  const textures = []
  const faces = []
  const materials = []
  const materialTypes = []

  const keyToFaceMap = {}
  const positionsMapped = []
  const normalesMapped = []
  const texturesMapped = []
  const facesMapped = []

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
      materials.push(currentMaterial)
      return
    }
    matches = REGEX_NORMALES.exec(line)
    if (matches) {
      normales.push(parseVectors(matches))
      return
    }
    matches = REGEX_TEXTURES.exec(line)
    if (matches) {
      textures.push(parseTextures(matches))
      return
    }
    matches = REGEX_FACES.exec(line)
    if (matches) {
      faces.push(...parseFaces(matches))
    }
  })

  const getKey = ({ v, vt, vn }) => `${v}_${vt}_${vn}`

  let nextIndex = 0
  faces.forEach((face, i) => {
    const { v, vt, vn } = face
    const key = getKey(face)
    const index = keyToFaceMap[key]
    if (typeof index !== 'undefined') {
      facesMapped.push(index)
    } else {
      facesMapped.push(nextIndex)
      keyToFaceMap[key] = nextIndex
      nextIndex += 1
      positionsMapped.push(...positions[v])
      texturesMapped.push(...textures[vt], materials[v])
      normalesMapped.push(...normales[vn])
    }
    // if (i >= 9) {
    //   console.log({
    //     keyToFaceMap,
    //     key,
    //     index,
    //     nextIndex,
    //     facesMapped,
    //     positionsMapped,
    //     texturesMapped,
    //     normalesMapped
    //   })
    //   throw new Error('stop')
    // }
  })

  const indexCount = facesMapped.length

  return {
    positions: positionsMapped,
    faces: facesMapped,
    textures: texturesMapped,
    normales: normalesMapped,
    indexCount,
    mtlData
  }
}

export default parseObj
