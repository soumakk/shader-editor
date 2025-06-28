export const defaultFragmentShader = `precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
  	// Animated colors using sine waves
    vec3 color = vec3(0.0);
    color.r = sin(u_time + st.x * 3.0) * 0.5 + 0.5;
    color.g = sin(u_time + st.y * 3.0) * 0.5 + 0.5; 
    color.b = sin(u_time + (st.x + st.y) * 2.0) * 0.5 + 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}
`

export const defaultVertexShader = `precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;

void main() {
    vUv = uv;
    
    // Simple wave displacement
    vec3 p = position;
    // p.z += sin(p.x * 2.0 + u_time) * 0.3;
    // p.z += cos(p.y * 3.0 + u_time * 0.2) * 0.2;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

export const initialFiles = {
	vertex: {
		language: 'glsl',
		name: 'vertex',
		value: defaultVertexShader,
	},
	fragment: {
		name: 'fragment',
		language: 'glsl',
		value: defaultFragmentShader,
	},
}
