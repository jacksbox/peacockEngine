const REGEX_POSITIONS = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_TEXTURES = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_FACES = /^f\s+(\d+)\/(\d+)(?:\/\d*){0,1}\s+(\d+)\/(\d+)(?:\/\d*){0,1}\s+(\d+)\/(\d+)(?:\/\d*){0,1}/
const REGEX_USEMTL = /^usemtl\s+(.*)/

const DEFAULT_COLOR = [0.6, 0.6, 0.6, 1.0]

const parseVectors = matches =>
  // prettier-ignore
  [
    parseFloat(matches[1]),
    parseFloat(matches[2]),
    parseFloat(matches[3])
  ]

const parseTextureCoordinates = matches =>
  // prettier-ignore
  [
    parseFloat(matches[1]),
    parseFloat(matches[2])
  ]

const parseFaces = matches =>
  // prettier-ignore
  [
    parseInt(matches[1], 10) - 1,
    parseInt(matches[3], 10) - 1,
    parseInt(matches[5], 10) - 1
  ]

const parseFacesTextureMaterials = (matches, m) =>
  // prettier-ignore
  [
    parseInt(matches[2], 10) - 1,
    parseInt(matches[4], 10) - 1,
    parseInt(matches[6], 10) - 1,
    m
  ]

const parseFacesMaterials = matches =>
  // prettier-ignore
  [
    parseInt(matches[2], 10) - 1,
    parseInt(matches[4], 10) - 1,
    parseInt(matches[6], 10) - 1
  ]

const getRandomColor = () =>
  // prettier-ignore
  [
    Math.random().toFixed(2),
    Math.random().toFixed(2),
    Math.random().toFixed(2),
    1.0
  ]

const setColor = color => [...(color || getRandomColor())]

const setMaterial = material => [material, material, material]

const parseObj = (text, mtlData = null) => {
  const lines = text.split('\n')

  const positions = []
  const textureCoordinates = []
  const colors = []
  const faces = []
  const facesTextures = []
  const facesMaterials = []
  const materialTypes = []

  let currentColor = DEFAULT_COLOR
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
      // if (material && mtlData[material]) {
      //   currentColor = [...mtlData[material].Kd, 1.0] || DEFAULT_COLOR
      //   return
      // }
    }
    matches = REGEX_POSITIONS.exec(line)
    if (matches) {
      positions.push(...parseVectors(matches))
      return
    }
    matches = REGEX_TEXTURES.exec(line)
    if (matches) {
      textureCoordinates.push(parseTextureCoordinates(matches))
      return
    }
    matches = REGEX_FACES.exec(line)
    if (matches) {
      faces.push(...parseFaces(matches))
      // facesTextures.push(...parseFacesTextureMaterials(matches, currentMaterial))
      facesTextures.push(...parseFacesMaterials(matches))
      facesMaterials.push(...setMaterial(currentMaterial))
      colors.push(...setColor(currentColor))
    }
  })

  const vertexCount = faces.length

  // console.log(colors.length / 4)
  // console.log(facesTextures.length / 4)

  const coords = []
  facesTextures.forEach(index => {
    coords.push(...textureCoordinates[index], facesMaterials[index])
  })

  return {
    positions,
    colors,
    faces,
    // facesTextures,
    facesMaterials,
    coords,
    // textureCoordinates,
    materialTypes,
    vertexCount,
    mtlData
  }
}

export default parseObj
