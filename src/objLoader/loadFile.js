const loadFile = async url => {
  const response = await fetch(url)
  const text = await response.text()

  return text
}

export default loadFile
