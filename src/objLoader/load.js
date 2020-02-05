import loadFile from './loadFile'
import parseObj from './parseObj'

const load = async url => {
  const text = await loadFile(url)
  const objData = parseObj(text)

  return objData
}

export default load
