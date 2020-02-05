const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const INDICES = /^f\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}/
// const INDICES = /^f\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}/

const getIndices = matches =>
  // prettier-ignore
  [
    parseInt(matches[1], 10) - 1,
    parseInt(matches[2], 10) - 1,
    parseInt(matches[3], 10) - 1
  ]

const getColors = () => {
  const v = parseFloat(Math.random().toFixed(2))
  const c = [v, v, v, 1.0]
  return [...c, ...c, ...c, ...c]
}

const loadObjectFile = async loc => {
  const response = await fetch(loc)
  const text = await response.text()
  const lines = text.split('\n')

  const positions = []
  const colors = []
  const indices = []

  let result
  let minIndex = 999999
  let maxIndex = -1
  let tIndices
  let faces = 0

  lines.forEach(line => {
    if ((result = POSITION.exec(line))) {
      positions.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]))
    } else if ((result = INDICES.exec(line))) {
      tIndices = getIndices(result)
      maxIndex = Math.max(maxIndex, ...tIndices)
      minIndex = Math.min(minIndex, ...tIndices)
      faces += 1
      indices.push(...tIndices)
      colors.push(...getColors())
    }
  })

  const vCount = indices.length

  console.log({
    positions: positions.length,
    vectors: positions.length / 3,
    faces,
    facesLength: indices.length,
    maxPositionIndex: maxIndex,
    minPositionIndex: minIndex,
    colors: colors.length / 4,
    colorsLength: colors.length
  })

  return {
    positions,
    colors,
    indices,
    vCount
  }
}

export default loadObjectFile
