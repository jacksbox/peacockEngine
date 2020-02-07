const vertexShader = `
attribute vec4 aVertexPosition;
attribute vec3 aVertextMaterial;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vMaterial;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vMaterial = aVertextMaterial;
}
`

export default vertexShader
