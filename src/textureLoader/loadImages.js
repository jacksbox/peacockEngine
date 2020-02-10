const loadImage = ({ file, basePath }) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.src = `${basePath}/${file.url}`
    image.onload = () => resolve({ name: file.name, src: image, index: file.i, url: file.url })
    image.onerror = () => reject()
  })

const loadImages = async ({ files, basePath }) => {
  const promises = files.map(file => loadImage({ file, basePath }))
  return Promise.all(promises)
}

export default loadImages
