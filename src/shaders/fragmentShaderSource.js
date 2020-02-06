const fragmentShader = materials => `
precision mediump float;

varying lowp vec4 vColor;
varying lowp vec3 vMaterial;

uniform sampler2D u_image_2;

void main() {
  // gl_FragColor = vColor;
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  if (vMaterial[2] == 6.0) {
    gl_FragColor = texture2D(u_image_2, vec2(vMaterial[0], vMaterial[1]));
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`

export default fragmentShader
