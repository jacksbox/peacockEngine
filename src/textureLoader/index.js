import loadImage from './loadImage'

const textureLoader = async ({ mtlData, basePath }) => {
  const promises = Object.keys(mtlData).map(async name => {
    const file = mtlData[name].map_Kd
    const texture = { name, ...mtlData[name] }
    if (!file) {
      return new Promise(resolve => resolve(texture))
    }
    return loadImage({ texture, basePath })
  })

  const textureData = await Promise.all(promises)

  return textureData
}

export default textureLoader
