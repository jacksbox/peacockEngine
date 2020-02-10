const loadImage = ({ texture, basePath }) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.src = `${basePath}/${texture.map_Kd}`
    image.onload = () => resolve({ ...texture, image })
    image.onerror = () => reject()
  })

export default loadImage
