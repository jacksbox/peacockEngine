import loadFile from './loadFile'
import parseObj from './parseObj'
import parseMtl from './parseMtl'

const REGEX_MTL = /^mtllib\s+(.*)$/m

const load = async (path, url) => {
  const objFile = await loadFile(`${path}/${url}`)

  let mtlData = null
  const [, match = null] = REGEX_MTL.exec(objFile) || [null, null]
  if (match) {
    const mtlFile = await loadFile(`${path}/${match}`)
    mtlData = parseMtl(mtlFile)
  } else {
    console.info('No associated mtl file defined')
  }

  const objData = parseObj(objFile, mtlData)

  return objData
}

export default load
