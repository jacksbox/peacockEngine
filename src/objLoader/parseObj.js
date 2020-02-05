const REGEX_POSITIONS = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const REGEX_FACES = /^f\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}\s+(\d+)(?:\/\d*){0,2}/

const DEFAULT_COLOR = [0.6, 0.6, 0.6, 1.0]

const parseVectors = matches =>
  // prettier-ignore
  [
    parseFloat(matches[1]),
    parseFloat(matches[2]),
    parseFloat(matches[3])
  ]

const parseFaces = matches =>
  // prettier-ignore
  [
    parseInt(matches[1], 10) - 1,
    parseInt(matches[2], 10) - 1,
    parseInt(matches[3], 10) - 1
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

const parseObj = text => {
  const lines = text.split('\n')

  const positions = []
  const colors = []
  const faces = []

  let matches
  lines.forEach(line => {
    matches = REGEX_POSITIONS.exec(line)
    if (matches) {
      positions.push(...parseVectors(matches))
      return
    }
    matches = REGEX_FACES.exec(line)
    if (matches) {
      faces.push(...parseFaces(matches))
      colors.push(...setColor(DEFAULT_COLOR))
    }
  })

  const vertexCount = faces.length

  return {
    positions,
    colors,
    faces,
    vertexCount
  }
}

export default parseObj
