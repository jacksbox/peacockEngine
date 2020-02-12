import loadFile from './loadFile'
import parseObj from './parseObj'
import parseMtl from './parseMtl'

const REGEX_MTL = /^mtllib\s+(.*)$/m

const objLoader = async ({ filename, basePath, vertexNormals }) => {
  const objFile = await loadFile(`${basePath}/${filename}`)

  let mtlData = null
  const [, mtlFilePath = null] = REGEX_MTL.exec(objFile) || [null, null]
  if (mtlFilePath) {
    const mtlFile = await loadFile(`${basePath}/${mtlFilePath}`)
    mtlData = parseMtl(mtlFile)
  } else {
    console.info('No associated mtl file defined')
  }

  const objData = parseObj({ text: objFile, mtlData, vertexNormals })

  return {
    objData,
    mtlData
  }
}

export default objLoader
