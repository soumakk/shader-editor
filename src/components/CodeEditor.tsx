import { Editor } from '@monaco-editor/react'
import { produce } from 'immer'
import React, { useState } from 'react'
import DarkTheme from './DarkTheme.json'
import clsx from 'clsx'

export default function CodeEditor({ files, setFiles }) {
	const [fileName, setFileName] = useState('vertex')

	const file = files[fileName]

	const handleEditorWillMount = (monaco) => {
		// Register a new language
		monaco.languages.register({ id: 'glsl' })

		// Register tokens provider for the language
		monaco.languages.setMonarchTokensProvider('glsl', {
			defaultToken: '',
			tokenPostfix: '.glsl',

			keywords: [
				'attribute',
				'const',
				'uniform',
				'varying',
				'break',
				'continue',
				'do',
				'for',
				'while',
				'if',
				'else',
				'in',
				'out',
				'inout',
				'float',
				'int',
				'void',
				'bool',
				'true',
				'false',
				'lowp',
				'mediump',
				'highp',
				'precision',
				'invariant',
				'discard',
				'return',
				'mat2',
				'mat3',
				'mat4',
				'vec2',
				'vec3',
				'vec4',
				'ivec2',
				'ivec3',
				'ivec4',
				'bvec2',
				'bvec3',
				'bvec4',
				'sampler2D',
				'samplerCube',
				'struct',
			],

			operators: [
				'=',
				'>',
				'<',
				'!',
				'~',
				'?',
				':',
				'==',
				'<=',
				'>=',
				'!=',
				'&&',
				'||',
				'++',
				'--',
				'+',
				'-',
				'*',
				'/',
				'&',
				'|',
				'^',
				'%',
				'<<',
				'>>',
				'>>>',
				'+=',
				'-=',
				'*=',
				'/=',
				'&=',
				'|=',
				'^=',
				'%=',
				'<<=',
				'>>=',
				'>>>=',
			],

			// we include these common regular expressions
			symbols: /[=><!~?:&|+\-*\/\^%]+/,

			// define escapes
			escapes: /\\(?:[abfnrtv\\"'0-9xun])/,

			// The main tokenizer for our languages
			tokenizer: {
				root: [
					// identifiers and keywords
					[
						/[a-zA-Z_]\w*/,
						{
							cases: {
								'@keywords': 'keyword',
								'@default': 'identifier',
							},
						},
					],

					// whitespace
					{ include: '@whitespace' },

					// delimiters and operators
					[/[{}()\[\]]/, '@brackets'],
					[/[<>](?!@symbols)/, '@brackets'],
					[
						/@symbols/,
						{
							cases: {
								'@operators': 'operator',
								'@default': '',
							},
						},
					],

					// numbers
					[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
					[/0[xX][0-9a-fA-F]+/, 'number.hex'],
					[/\d+/, 'number'],

					// delimiter: after number because of .\d floats
					[/[;,.]/, 'delimiter'],

					// strings
					[/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
					[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
				],

				whitespace: [
					[/[ \t\r\n]+/, ''],
					[/\/\*/, 'comment', '@comment'],
					[/\/\/.*$/, 'comment'],
				],

				comment: [
					[/[^\/*]+/, 'comment'],
					[/\/\*/, 'comment', '@push'],
					['\\*/', 'comment', '@pop'],
					[/[\/*]/, 'comment'],
				],

				string: [
					[/[^\\"]+/, 'string'],
					[/@escapes/, 'string.escape'],
					[/\\./, 'string.escape.invalid'],
					[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
				],
			},
		})

		// Register a default formatting for the language
		monaco.languages.setLanguageConfiguration('glsl', {
			comments: {
				lineComment: '//',
				blockComment: ['/*', '*/'],
			},
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			],
			autoClosingPairs: [
				{ open: '{', close: '}' },
				{ open: '[', close: ']' },
				{ open: '(', close: ')' },
				{ open: '"', close: '"' },
				{ open: "'", close: "'" },
			],
		})
	}

	const handleEditorDidMount = (editor, monaco) => {
		// Define a theme
		monaco?.editor?.defineTheme('dark', DarkTheme)

		// Set the custom theme
		monaco.editor.setTheme('dark')
	}
	console.log(fileName)
	return (
		<>
			<div className="flex bg-surface gap-2  border-divider px-4 py-2">
				<FileTab isActive={fileName === 'vertex'} onClick={() => setFileName('vertex')} title="vertex.glsl" />
				<FileTab isActive={fileName === 'fragment'} onClick={() => setFileName('fragment')} title="fragment.glsl" />
			</div>
			<Editor
				height="100%"
				theme="vs-dark"
				path={file.name}
				defaultLanguage={file.language}
				value={file.value}
				onMount={handleEditorDidMount}
				beforeMount={handleEditorWillMount}
				onChange={(value) => {
					setFiles(
						produce((draft) => {
							draft[fileName].value = value
						})
					)
				}}
			/>
		</>
	)
}

function FileTab({ isActive, onClick, title }) {
	return (
		<button
			className={clsx('bg-surface flex items-center gap-1 text-white text-sm p-1.5 px-3 hover:bg-accent rounded-md', {
				'!bg-accent': isActive,
			})}
			onClick={onClick}
		>
			<img src="/shader.svg" className="h-4 w-4" />
			{title}
		</button>
	)
}
