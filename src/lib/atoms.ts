import { atom } from "jotai";

export const primitiveAtom = atom("plane");

export interface ShaderError {
  id: string;
  message: string;
  line: number;
  snippet?: string;
}

export const previewSettingsAtom = atom({
  wireframe: false,
  autoRotate: false,
  grid: true,
});

export const errorsAtom = atom<ShaderError[]>([]);

export type UniformType = "float" | "vec2" | "vec3";

export interface CustomUniform {
  id: string;
  name: string;
  type: UniformType;
  value: any; // number for float, [x, y] for vec2, [x, y, z] for vec3
}

export const customUniformsAtom = atom<CustomUniform[]>([
  { id: "1", name: "u_color", type: "vec3", value: [0.6, 0.3, 1.0] },
  { id: "2", name: "u_frequency", type: "float", value: 1.2 },
  { id: "3", name: "u_amplitude", type: "float", value: 0.8 },
]);

export enum ModelType {
  Plane = "plane",
  Sphere = "sphere",
  Torus = "torus",
  Knot = "knot",
  Suzanne = "suzanne",
}

export const modelOptions = [
  { label: "Plane", value: ModelType.Plane },
  { label: "Sphere", value: ModelType.Sphere },
  { label: "Torus", value: ModelType.Torus },
  { label: "Knot", value: ModelType.Knot },
  // { label: "Suzanne", value: ModelType.Suzanne },
];
