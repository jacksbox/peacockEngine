const fragmentShader = glTextureData => `
precision mediump float;

varying highp vec3 vMaterial;

${glTextureData.map(({ name, glTexture }) => (glTexture ? `uniform sampler2D ${name};` : null)).join('\n')}

varying highp vec3 vLighting;

vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
  ${glTextureData
    .map(({ id, name, Kd, glTexture }) => {
      let line = `if(vMaterial[2] == ${id}.0) {\n`
      if (glTexture) {
        line = `${line}    color = texture2D(${name}, vec2(vMaterial.x, vMaterial.y));`
      } else if (Kd) {
        line = `${line}    color = vec4(vec3(${Kd.join(', ')}), 1.0);`
      } else {
        line = `${line}    color = vec4(1, 0, 1, 1);`
      }
      return `${line}  \n  }`
    })
    .join('\n  else ')}

  gl_FragColor = vec4(color.rgb * vLighting, 1.0);
}
`

export default fragmentShader
