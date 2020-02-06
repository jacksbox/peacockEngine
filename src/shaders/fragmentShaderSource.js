const fragmentShader = `
// varying lowp vec4 vColor;

void main() {
  // gl_FragColor = vColor;
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

export default fragmentShader
