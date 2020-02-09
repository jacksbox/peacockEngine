const fragmentShader = uniforms => `
precision mediump float;

varying highp vec3 vMaterial;

${uniforms.map(({ name }) => `uniform sampler2D ${name};`).join('\n')}

varying highp vec3 vLighting;

vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
  // gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * vLighting, 1.0);


  if (vMaterial[2] == 0.0) {
    color = vec4(vec3(0, 1.0, 0), 1.0);
  } else
  if (vMaterial[2] == 1.0) {
    color = vec4(vec3(0, 1.0, 1.0), 1.0);
  } else
  if (vMaterial[2] == 2.0) {
    color = texture2D(u_image_0, vec2(vMaterial.x, vMaterial.y));
  } else
  if (vMaterial[2] == 3.0) {
    color = texture2D(u_image_1, vec2(vMaterial.x, vMaterial.y));
  }  else
  if (vMaterial[2] == 4.0) {
    color = texture2D(u_image_2, vec2(vMaterial.x, vMaterial.y));
  }  else
  if (vMaterial[2] == 5.0) {
    color = texture2D(u_image_3, vec2(vMaterial.x, vMaterial.y));
  } else {
    color = texture2D(u_image_4, vec2(vMaterial.x, vMaterial.y));
  }
  gl_FragColor = vec4(color.rgb * vLighting, 1.0);
}
`

export default fragmentShader
