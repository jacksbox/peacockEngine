const vertexShader = `
attribute vec4 aVertexPosition;
attribute vec3 aVertextMaterial;
attribute vec3 aVertexNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uNormalMatrix;

varying highp vec3 vMaterial;
varying highp vec3 vLighting;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
  vMaterial = aVertextMaterial;


  highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 1));
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
`

export default vertexShader
