// lib/glslValidator.ts
import { ShaderError } from "./atoms";

// Create an invisible canvas to act as our native compiler
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

export function validateFragmentShader(userCode: string): ShaderError[] {
  if (!gl) return [];

  // 1. Mock the uniforms Three.js provides automatically
  const prefix = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
`;

  // Count how many lines we added so we can offset the error line numbers later
  const prefixLines = prefix.split("\n").length;
  const fullCode = prefix + userCode;

  // 2. Try to compile natively
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!shader) return [];

  gl.shaderSource(shader, fullCode);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  // 3. If it fails, parse the native WebGL info log
  if (!compiled) {
    const errorLog = gl.getShaderInfoLog(shader);
    if (!errorLog) return [];

    const errors: ShaderError[] = [];
    // WebGL errors look like: "ERROR: 0:25: 'assign' : cannot convert..."
    const regex = /ERROR: \d+:(\d+): (.*)/g;
    let match;

    while ((match = regex.exec(errorLog)) !== null) {
      const rawLine = parseInt(match[1], 10);
      const actualLine = rawLine - prefixLines; // Adjust back to user's line number
      const msg = match[2];

      const snippet = userCode.split("\n")[actualLine - 1]?.trim() || "";

      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        message: msg,
        line: actualLine,
        snippet: snippet,
      });
    }

    // Clean up
    gl.deleteShader(shader);
    return errors;
  }

  // Clean up
  gl.deleteShader(shader);
  return []; // No errors!
}
