import { shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement, useFrame } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  customUniformsAtom,
  errorsAtom,
  ModelType,
  previewSettingsAtom,
  primitiveAtom,
} from "../../lib/atoms";
import {
  defaultFragmentShader,
  defaultVertexShader,
} from "../../lib/defaultShader";
import { processShaderIncludes } from "../../lib/shaderModules";

const CustomShaderMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(),
    u_mouse: new THREE.Vector2(),
  },
  processShaderIncludes(defaultVertexShader),
  processShaderIncludes(defaultFragmentShader),
);

declare module "@react-three/fiber" {
  interface ThreeElements {
    customShaderMaterial: ThreeElement<typeof CustomShaderMaterial>;
  }
}

extend({ CustomShaderMaterial });

export default function ShaderMesh({
  fragmentShader,
  vertexShader,
  isPlaying,
  timeScale,
  timeDisplayRef,
}: {
  fragmentShader: string;
  vertexShader: string;
  isPlaying: boolean;
  timeScale: number;
  timeDisplayRef: React.RefObject<HTMLSpanElement>;
}) {
  const [activePrimitive] = useAtom(primitiveAtom);
  const setErrors = useSetAtom(errorsAtom);
  const [customUniforms] = useAtom(customUniformsAtom);
  // const { nodes, materials } = useGLTF("/suzanne.glb");
  const settings = useAtomValue(previewSettingsAtom);

  const materialRef = useRef<any>(null);
  const timeRef = useRef(0);

  const [currentShader, setCurrentShader] = useState({
    fragment: fragmentShader,
    vertex: vertexShader,
  });

  useEffect(() => {
    if (materialRef.current) {
      let resolvedFragment = processShaderIncludes(fragmentShader);
      let resolvedVertex = processShaderIncludes(vertexShader);

      if (
        resolvedFragment !== currentShader.fragment ||
        resolvedVertex !== currentShader.vertex
      ) {
        // 1. Clear old errors
        // setErrors([]);

        // 2. Hack Mode: Hijack console.error
        // const originalError = console.error;
        // console.error = (...args) => {
        //   // Join with newline just in case the browser splits the arguments
        //   const errorMsg = args.join("\n");

        //   if (errorMsg.includes("THREE.WebGLProgram: Shader Error")) {
        //     const newErrors: any[] = [];

        //     // Catch the format "ERROR: 0:170: ..."
        //     const regex = /ERROR: \d+:(\d+): (.*)/g;
        //     let match;

        //     while ((match = regex.exec(errorMsg)) !== null) {
        //       const threeLineNum = parseInt(match[1], 10);
        //       const msg = match[2];

        //       // 1. Extract the exact code snippet that failed from the Three.js log
        //       // It looks like: "> 170: color.r = sin(u_time..."
        //       const snippetRegex = new RegExp(`>\\s*${threeLineNum}:\\s*(.*)`);
        //       const snippetMatch = errorMsg.match(snippetRegex);
        //       const snippet = snippetMatch ? snippetMatch[1].trim() : "";

        //       // 2. Search your RAW Monaco code to find where that snippet actually lives
        //       let realLineNum = threeLineNum; // Fallback just in case

        //       if (snippet) {
        //         // Split the raw editor code into lines
        //         const userLines = fragmentShader.split("\n");

        //         // Find which line contains the failing snippet
        //         const foundIndex = userLines.findIndex((line) =>
        //           line.includes(snippet),
        //         );

        //         if (foundIndex !== -1) {
        //           realLineNum = foundIndex + 1; // +1 because arrays start at 0
        //         }
        //       }

        //       newErrors.push({
        //         id: Math.random().toString(36).substr(2, 9),
        //         message: `${msg}`,
        //         line: realLineNum,
        //         snippet: snippet,
        //       });
        //     }

        //     if (newErrors.length > 0) {
        //       setErrors(newErrors);
        //     }
        //   }

        //   // Still log to dev tools so you can inspect the raw stack trace if needed
        //   originalError.apply(console, args);
        // };

        // 3. Compile the shader
        materialRef.current.fragmentShader = resolvedFragment;
        materialRef.current.vertexShader = resolvedVertex;
        materialRef.current.needsUpdate = true;

        setCurrentShader({
          fragment: resolvedFragment,
          vertex: resolvedVertex,
        });

        // 4. Cleanup the hijack immediately after the WebGL thread catches it
        // setTimeout(() => {
        //   console.error = originalError;
        // }, 50);
      }
    }
  }, [
    fragmentShader,
    vertexShader,
    currentShader.fragment,
    currentShader.vertex,
    setErrors,
    // customUniforms, // <-- Added customUniforms as dependency
  ]);

  useFrame(({ size, mouse }, delta) => {
    if (isPlaying) {
      timeRef.current += delta * timeScale;
    }

    if (materialRef.current) {
      // Default Uniforms
      materialRef.current.u_time = timeRef.current;
      materialRef.current.u_resolution = [size.width, size.height];
      materialRef.current.u_mouse = [mouse.x, mouse.y];

      // Dynamic Uniforms fed into the GPU frame-by-frame
      customUniforms.forEach((u) => {
        if (!materialRef.current.uniforms[u.name]) {
          materialRef.current.uniforms[u.name] = { value: null };
        }

        if (u.type === "float") {
          materialRef.current.uniforms[u.name].value = u.value;
        } else if (u.type === "vec2") {
          materialRef.current.uniforms[u.name].value = new THREE.Vector2(
            u.value[0],
            u.value[1],
          );
        } else if (u.type === "vec3") {
          materialRef.current.uniforms[u.name].value = new THREE.Vector3(
            u.value[0],
            u.value[1],
            u.value[2],
          );
        }
      });
    }

    if (timeDisplayRef.current) {
      timeDisplayRef.current.innerText = timeRef.current.toFixed(2);
    }
  });

  function getPrimitive(type: string) {
    switch (type) {
      case ModelType.Plane:
        return <planeGeometry args={[2, 2, 100, 100]} />;
      case ModelType.Sphere:
        return <sphereGeometry args={[1, 128, 64]} />;
      case ModelType.Torus:
        return <torusGeometry args={[0.7, 0.3, 16, 100]} />;
      case ModelType.Knot:
        return <torusKnotGeometry args={[0.7, 0.3, 256, 32]} />;
      // case ModelType.Cylinder:
      //   return <cylinderGeometry args={[1, 1, 2, 32]} />;
      default:
        return <planeGeometry args={[2, 2, 100, 100]} />;
    }
  }

  // if (activePrimitive === ModelType.Suzanne) {
  //   return (
  //     <mesh geometry={(nodes.Suzanne as any).geometry}>
  //       <customShaderMaterial
  //         ref={materialRef}
  //         key={CustomShaderMaterial.key}
  //         wireframe={settings?.wireframe}
  //       />
  //     </mesh>
  //   );
  // }

  return (
    <mesh>
      {getPrimitive(activePrimitive)}
      <customShaderMaterial
        ref={materialRef}
        key={CustomShaderMaterial.key}
        wireframe={settings?.wireframe}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// useGLTF.preload("/suzanne.glb");
