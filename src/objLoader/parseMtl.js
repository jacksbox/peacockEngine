/* eslint-disable no-extra-semi, camelcase */

const REGEX_NEWMTL = /^newmtl\s+(.*)/
const REGEX_MAPKD = /^map_Kd\s+(.*)/
const REGEX_COLORS = /^(Ka|Kd|Ks)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)/

const parseMtl = text => {
  const lines = text.split('\n')

  const materials = {}

  let currentMaterial = null

  let id = 0
  let name
  let type // Ka, Kd, Ks
  let r
  let g
  let b
  let map_Kd

  lines.forEach(line => {
    ;[, name] = REGEX_NEWMTL.exec(line) || [null, null]
    if (name) {
      currentMaterial = name
      materials[currentMaterial] = {
        id
      }
      id += 1
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
    ;[, map_Kd] = REGEX_MAPKD.exec(line) || [null, null]
    if (map_Kd) {
      materials[currentMaterial].map_Kd = map_Kd
    }
  })

  return materials
}

export default parseMtl
