const REGEX_POSITIONS = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_TEXTURES = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_FACES = /^f\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}/
const REGEX_USEMTL = /^usemtl\s+(.*)/

// const DEFAULT_COLOR = [0.6, 0.6, 0.6, 1.0]

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
    parseInt(matches[2], 10) - 1,
    parseInt(matches[3], 10) - 1
  ]

// const getRandomColor = () =>
//   // prettier-ignore
//   [
//     Math.random().toFixed(2),
//     Math.random().toFixed(2),
//     Math.random().toFixed(2),
//     1.0
//   ]

// const setColor = color => [...(color || getRandomColor())]

const setMaterial = material => [material, material, material]

const parseObj = (text, mtlData = null) => {
  const lines = text.split('\n')

  const positions = []
  const textureCoordinates = []
  // const colors = []
  const faces = []
  const materialTypes = []
  const materials = []

  // let currentColor = DEFAULT_COLOR
  let currentMaterial = 0
  let matches
  lines.forEach(line => {
    if (mtlData) {
      const [, material] = REGEX_USEMTL.exec(line) || [null, null]
      if (material) {
        const i = materialTypes.indexOf(material)
        if (i > -1) {
          currentMaterial = 1
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
      textureCoordinates.push(...parseTextureCoordinates(matches))
      return
    }
    matches = REGEX_FACES.exec(line)
    if (matches) {
      faces.push(...parseFaces(matches))
      materials.push(...setMaterial(currentMaterial))
      // colors.push(...setColor(currentColor))
    }
  })

  const vertexCount = faces.length

  console.log({
    positions,
    // colors,
    faces,
    materials,
    materialTypes,
    vertexCount
  })

  return {
    positions,
    // colors,
    faces,
    materials,
    materialTypes,
    vertexCount
  }
}

export default parseObj
