import Editor, { Monaco } from '@monaco-editor/react'
import clsx from 'clsx'
import { produce } from 'immer'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { IFiles } from '../lib/types'

function ShaderEditor({
	files,
	setFiles,
}: {
	files: IFiles
	setFiles: Dispatch<SetStateAction<IFiles>>
}) {
	const editorRef = useRef(null)
	const monacoRef = useRef(null)

	const [fileName, setFileName] = useState('fragment')
	const currentFile = files[fileName]

	function handleEditorDidMount(editor: any, monaco: Monaco) {
		editorRef.current = editor
		monacoRef.current = monaco

		// Register GLSL language if not already registered
		if (!monaco.languages.getLanguages().find((lang: any) => lang.id === 'glsl')) {
			monaco.languages.register({ id: 'glsl' })

			// Enhanced GLSL syntax highlighting
			monaco.languages.setMonarchTokensProvider('glsl', {
				tokenizer: {
					root: [
						[
							/\b(precision|attribute|uniform|varying|void|float|int|bool|vec2|vec3|vec4|mat2|mat3|mat4|sampler2D|samplerCube)\b/,
							'keyword',
						],
						[
							/\b(gl_Position|gl_FragColor|gl_FragCoord|gl_PointSize)\b/,
							'variable.predefined',
						],
						[
							/\b(main|sin|cos|tan|length|normalize|dot|cross|mix|step|smoothstep|clamp|abs|sign|floor|ceil|fract|mod|min|max|pow|exp|log|sqrt|texture2D)\b/,
							'function',
						],
						[/\b(mediump|highp|lowp)\b/, 'keyword'],
						[/[0-9]*\.[0-9]+([eE][\-+]?[0-9]+)?/, 'number.float'],
						[/[0-9]+/, 'number'],
						[/".*?"/, 'string'],
						[/\/\/.*$/, 'comment'],
						[/\/\*[\s\S]*?\*\//, 'comment'],
					],
				},
			})
		}
	}

	function handleEditorChange(value?: string) {
		setFiles(
			produce((draft: any) => {
				draft[fileName].value = value || ''
			})
		)
	}

	return (
		<div className="h-full rounded-lg bg-neutral-900 mr-1">
			<div className="flex gap-2 p-1">
				<FileTab
					isActive={fileName === 'vertex'}
					onClick={() => setFileName('vertex')}
					title="vertex.glsl"
				/>
				<FileTab
					isActive={fileName === 'fragment'}
					onClick={() => setFileName('fragment')}
					title="fragment.glsl"
				/>
			</div>
			<Editor
				height="100%"
				defaultLanguage={currentFile.language}
				path={currentFile.name}
				value={currentFile.value}
				theme="vs-dark"
				onMount={handleEditorDidMount}
				onChange={handleEditorChange}
				options={{
					minimap: { enabled: false },
					automaticLayout: true,
					fontSize: 14,
					wordWrap: 'on',
					lineNumbers: 'on',
					folding: true,
					bracketMatching: 'always',
				}}
			/>
		</div>
	)
}

export default ShaderEditor

function FileTab({
	isActive,
	onClick,
	title,
}: {
	isActive: boolean
	onClick: () => void
	title: string
}) {
	return (
		<button
			className={clsx(
				'bg-neutral-900 flex items-center gap-1 text-white text-sm p-2 px-4 rounded-md cursor-pointer',
				{
					'!bg-neutral-800': isActive,
				}
			)}
			onClick={onClick}
		>
			<img src="/shader.svg" className="h-4 w-4" />
			{title}
		</button>
	)
}
