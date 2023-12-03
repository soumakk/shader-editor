import { Editor } from '@monaco-editor/react'
import { useState } from 'react'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import { produce } from 'immer'

function App() {
	const initialFiles = {
		vertex: {
			language: 'glsl',
			name: 'vertex',
			value: `attribute vec3 position;
      
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
		},
		fragment: {
			name: 'fragment',
			language: 'glsl',
			value: `void main() {
  gl_FragColor = vec4(.0,0.5,1.0,1.0);
}`,
		},
	}
	const [files, setFiles] = useState(initialFiles)

	const [fileName, setFileName] = useState('vertex')

	const file = files[fileName]

	const vertex = files['vertex'].value
	const fragment = files['fragment'].value

	const srcDoc = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body, #app {
        height: 100%;
        width: 100%;
      }
      #app {
        position: fixed;
        inset: 0;
      }
      canvas {
        display: block;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import {Renderer, Camera, Program, Mesh, Box,Transform, Orbit,Vec3} from 'https://cdn.jsdelivr.net/npm/ogl/dist/ogl.mjs';

      const renderer = new Renderer();
      const gl = renderer.gl;
      document.getElementById("app").appendChild(gl.canvas);
      
      const camera = new Camera(gl);
      camera.position.z = 5;
      
      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({
            aspect: gl.canvas.width / gl.canvas.height,
        });
      }
      window.addEventListener('resize', resize, false);
      resize();
      
      const controls = new Orbit(camera, {
        target: new Vec3(0, 0, 0),
      });

      const scene = new Transform();
      
      const geometry = new Box(gl);
    
      const program = new Program(gl, {
          vertex: \`${vertex}\`,
          fragment: \`${fragment}\`,
      });
  
      const mesh = new Mesh(gl, {geometry, program});
      mesh.setParent(scene);
  
      requestAnimationFrame(update);
      function update(t) {
          requestAnimationFrame(update);
          controls.update();
          
          renderer.render({scene, camera});
      }
    </script>
  </body>
</html>

  `

	return (
		<div className="h-screen">
			<Allotment>
				<Allotment.Pane minSize={300}>
					<div className="flex bg-[#1e1e1e] border-b border-zinc-700 ">
						<button
							className="bg-[#1e1e1e] text-white text-sm p-2"
							disabled={fileName === 'vertex'}
							onClick={() => setFileName('vertex')}
						>
							vertex
						</button>
						<button
							className="bg-[#1e1e1e] text-white text-sm p-2"
							disabled={fileName === 'fragment'}
							onClick={() => setFileName('fragment')}
						>
							fragment
						</button>
					</div>
					<Editor
						height="100%"
						theme="vs-dark"
						path={file.name}
						defaultLanguage={file.language}
						value={file.value}
						onChange={(value) => {
							setFiles(
								produce((draft) => {
									draft[fileName].value = value
								})
							)
						}}
					/>
				</Allotment.Pane>
				<Allotment.Pane snap minSize={300}>
					<div className="h-full">
						<iframe className="h-full w-full" srcDoc={srcDoc}></iframe>
					</div>
				</Allotment.Pane>
			</Allotment>
		</div>
	)
}

export default App
