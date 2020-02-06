const vertexShader = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertextMaterial;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;
varying lowp vec3 vMaterial;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
  vMaterial = aVertextMaterial;
}
`

export default vertexShader
