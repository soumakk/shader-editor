import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import { useState } from 'react'
import ShaderEditor from './components/ShaderEditor'
import ShaderPreview from './components/ShaderPreview'
import { initialFiles } from './lib/defaultShader'
import { IFiles } from './lib/types'
import ActionMenu from './components/ActionMenu'

function App() {
	const [files, setFiles] = useState<IFiles>(initialFiles)

	return (
		<div className="h-screen bg-neutral-950 p-2">
			<Allotment>
				<Allotment.Pane minSize={300}>
					<ShaderEditor files={files} setFiles={setFiles} />
				</Allotment.Pane>
				<Allotment.Pane snap minSize={300}>
					<ShaderPreview
						fragmentShader={files['fragment'].value}
						vertexShader={files['vertex'].value}
					/>
				</Allotment.Pane>
			</Allotment>

			<ActionMenu />
		</div>
	)
}

export default App
