const fragmentShader = uniforms => `
precision mediump float;

varying lowp vec4 vColor;
varying highp vec3 vMaterial;

${uniforms.map(({ name }) => `uniform sampler2D ${name};`).join('\n')}
${uniforms.map(({ name, w, h }) => `vec2 ${name}_size = vec2(float(${w}), float(${h}));`).join('\n')}

void main() {
  // gl_FragColor = vColor;
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  if (vMaterial[2] == 2.0) {
    gl_FragColor = texture2D(u_image_0, vec2(vMaterial.x, vMaterial.y));
  } else
  if (vMaterial[2] == 3.0) {
    gl_FragColor = texture2D(u_image_1, vec2(vMaterial.x / u_image_1_size.x, vMaterial.y / u_image_1_size.y));
  }  else
  if (vMaterial[2] == 4.0) {
    gl_FragColor = texture2D(u_image_2, vec2(vMaterial.x / u_image_2_size.x, vMaterial.y / u_image_2_size.y));
  }  else
  if (vMaterial[2] == 5.0) {
    gl_FragColor = texture2D(u_image_3, vec2(vMaterial.x / u_image_3_size.x, vMaterial.y / u_image_3_size.y));
  }   else
  if (vMaterial[2] == 6.0) {
    gl_FragColor = texture2D(u_image_4, vec2(vMaterial.x / u_image_4_size.x, vMaterial.y / u_image_4_size.y));
  }   else
  if (vMaterial[2] == 8.0) {
    gl_FragColor = texture2D(u_image_5, vec2(vMaterial.x / u_image_5_size.x, vMaterial.y / u_image_5_size.y));
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`

export default fragmentShader
