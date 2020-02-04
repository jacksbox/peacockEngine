const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
const INDICES = /^f\s+(\d+)(?:\/\d+){0,2}\s+(\d+)(?:\/\d+){0,2}\s+(\d+)(?:\/\d+){0,2}/

const loadObjectFile = async loc => {
  const response = await fetch(loc)
  const text = await response.text()
  const lines = text.split('\n')

  const positions = []
  let colors = []
  const indices = []

  let result
  let cValue
  let color
  lines.forEach(line => {
    if ((result = POSITION.exec(line))) {
      positions.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]))
    } else if ((result = INDICES.exec(line))) {
      indices.push(parseInt(result[1]) - 1, parseInt(result[2]) - 1, parseInt(result[3]) - 1)
      cValue = parseFloat(Math.random().toFixed(2))
      color = [cValue, cValue, cValue, 1.0]
      colors = [...colors, ...color, ...color, ...color]
    }
  })

  const vCount = indices.length

  console.log({
    positions,
    colors,
    indices,
    vCount,
    pos: positions.length / 3,
    iMax: Math.max(...indices),
    cNum: indices.length * 4
  })

  return {
    positions,
    colors,
    indices,
    vCount
  }
}

export default loadObjectFile
