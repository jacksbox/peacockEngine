import loadImages from './loadImages'

const textureLoader = async ({ mtlData, basePath }) => {
  const files = Object.keys(mtlData).reduce((acc, name, i) => {
    if (mtlData[name].map_Kd) {
      acc.push({ url: mtlData[name].map_Kd, name, i })
    }
    return acc
  }, [])

  const textureData = await loadImages({ files, basePath })

  return textureData
}

export default textureLoader
