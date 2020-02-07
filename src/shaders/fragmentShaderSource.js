const fragmentShader = uniforms => `
precision mediump float;

varying highp vec3 vMaterial;

${uniforms.map(({ name }) => `uniform sampler2D ${name};`).join('\n')}

void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  // if (vMaterial[2] == 2.0) {
  //   gl_FragColor = texture2D(u_image_0, vec2(vMaterial.x, vMaterial.y));
  // } else
  // if (vMaterial[2] == 3.0) {
  //   gl_FragColor = texture2D(u_image_1, vec2(vMaterial.x, vMaterial.y));
  // }  else
  // if (vMaterial[2] == 4.0) {
  //   gl_FragColor = texture2D(u_image_2, vec2(vMaterial.x, vMaterial.y));
  // }  else
  // if (vMaterial[2] == 5.0) {
  //   gl_FragColor = texture2D(u_image_3, vec2(vMaterial.x, vMaterial.y));
  // }   else
  // if (vMaterial[2] == 6.0) {
  //   gl_FragColor = texture2D(u_image_4, vec2(vMaterial.x, vMaterial.y));
  // }   else
  // if (vMaterial[2] == 8.0) {
  //   gl_FragColor = texture2D(u_image_5, vec2(vMaterial.x, vMaterial.y));
  // } else {
  //   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  // }
}
`

export default fragmentShader
