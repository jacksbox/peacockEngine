const REGEX_NEWMTL = /^newmtl\s+(.*)/
const REGEX_MAPKD = /^map_Kd\s+(.*)/
const REGEX_COLORS = /^(Ka|Kd|Ks)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)/

const parseMtl = text => {
  const lines = text.split('\n')

  const materials = {}
  let currentMaterial = null
  let name
  let type
  let r
  let g
  let b
  let file
  lines.forEach(line => {
    ;[, name] = REGEX_NEWMTL.exec(line) || [null, null]
    if (name) {
      currentMaterial = name
      materials[currentMaterial] = {}
      return
    }
    ;[, type, r, g, b] = REGEX_COLORS.exec(line) || [null, null, null, null]
    if (type) {
      materials[currentMaterial][type] =
        // prettier-ignore
        [
          parseFloat(r),
          parseFloat(g),
          parseFloat(b)
        ]
    }
    ;[, file] = REGEX_MAPKD.exec(line) || [null, null]
    if (file) {
      materials[currentMaterial].file = file
    }
  })

  return materials
}

export default parseMtl
