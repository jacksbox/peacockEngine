const REGEX_NEWMTL = /^newmtl\s+(.*)/
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
  })

  return materials
}

export default parseMtl
