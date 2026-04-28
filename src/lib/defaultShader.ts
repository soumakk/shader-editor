export const defaultVertexShader = `precision mediump float;

// default uniforms
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// varyings
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;


void main() {
    v_uv = uv;
    v_normal = normal;
    v_position = position;

    // position each vertex on the screen
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const defaultFragmentShader = `precision mediump float;

// default uniforms
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// custom uniforms
uniform float u_frequency;
uniform float u_amplitude;
uniform vec3 u_color;

// varyings
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;

// include pre injected noise functions, cnoise | snoise
#include <snoise>

void main() {
  // generate the base noise
  float n = snoise(v_position * u_frequency + (u_time * 0.1)) * u_amplitude;

  // chop it to bands
  float bands = fract(n * 4.0);

  // create the glowing edge
  float glow = smoothstep(0.1, 0.0, bands) + smoothstep(0.5, 1.0, bands);

  // mix the colors
  vec3 background = u_color * 0.25;
  vec3 finalColor = mix(background, u_color, glow);

  // output to the screen
  gl_FragColor = vec4(finalColor, 1.0);
}

`;

export const initialFiles = {
  vertex: {
    language: "glsl",
    name: "vertex",
    value: defaultVertexShader,
  },
  fragment: {
    name: "fragment",
    language: "glsl",
    value: defaultFragmentShader,
  },
};
