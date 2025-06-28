import { Monaco } from '@monaco-editor/react'

export function setupGLSLLanguage(monaco: Monaco) {
	// Register GLSL language
	monaco.languages.register({ id: 'glsl' })

	// Language configuration for commenting and bracket matching
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
		surroundingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
		wordPattern:
			/(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
	})
}

export function setupGLSLCompletionProvider(monaco: Monaco) {
	monaco.languages.registerCompletionItemProvider('glsl', {
		triggerCharacters: ['.', '(', ' '],
		provideCompletionItems: function (model: any, position: any) {
			const word = model.getWordUntilPosition(position)
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			}

			return {
				suggestions: [
					// Data type constructors with tab stops
					{
						label: 'vec2',
						kind: monaco.languages.CompletionItemKind.Constructor,
						insertText: 'vec2(${1:x}, ${2:y})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: '2-component floating point vector',
						detail: 'vec2(float x, float y)',
						range: range,
					},
					{
						label: 'vec3',
						kind: monaco.languages.CompletionItemKind.Constructor,
						insertText: 'vec3(${1:x}, ${2:y}, ${3:z})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: '3-component floating point vector',
						detail: 'vec3(float x, float y, float z)',
						range: range,
					},
					{
						label: 'vec4',
						kind: monaco.languages.CompletionItemKind.Constructor,
						insertText: 'vec4(${1:x}, ${2:y}, ${3:z}, ${4:w})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: '4-component floating point vector',
						detail: 'vec4(float x, float y, float z, float w)',
						range: range,
					},
					{
						label: 'mat3',
						kind: monaco.languages.CompletionItemKind.Constructor,
						insertText: 'mat3(${1:1.0})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: '3x3 matrix',
						detail: 'mat3(float diagonal)',
						range: range,
					},
					{
						label: 'mat4',
						kind: monaco.languages.CompletionItemKind.Constructor,
						insertText: 'mat4(${1:1.0})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: '4x4 matrix',
						detail: 'mat4(float diagonal)',
						range: range,
					},

					// Built-in functions with signatures[1][5]
					{
						label: 'texture',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'texture(${1:sampler}, ${2:coords})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Sample texture at given coordinates',
						detail: 'vec4 texture(sampler2D sampler, vec2 coords)',
						range: range,
					},
					{
						label: 'normalize',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'normalize(${1:vector})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns normalized vector',
						detail: 'genType normalize(genType vector)',
						range: range,
					},
					{
						label: 'dot',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'dot(${1:a}, ${2:b})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns dot product of two vectors',
						detail: 'float dot(genType a, genType b)',
						range: range,
					},
					{
						label: 'cross',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'cross(${1:a}, ${2:b})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns cross product of two 3D vectors',
						detail: 'vec3 cross(vec3 a, vec3 b)',
						range: range,
					},
					{
						label: 'length',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'length(${1:vector})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns length of vector',
						detail: 'float length(genType vector)',
						range: range,
					},
					{
						label: 'distance',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'distance(${1:a}, ${2:b})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns distance between two points',
						detail: 'float distance(genType a, genType b)',
						range: range,
					},
					{
						label: 'mix',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'mix(${1:a}, ${2:b}, ${3:t})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Linear interpolation between a and b',
						detail: 'genType mix(genType a, genType b, float t)',
						range: range,
					},
					{
						label: 'clamp',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'clamp(${1:value}, ${2:min}, ${3:max})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Clamp value between min and max',
						detail: 'genType clamp(genType value, genType min, genType max)',
						range: range,
					},
					{
						label: 'smoothstep',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'smoothstep(${1:edge0}, ${2:edge1}, ${3:x})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Smooth Hermite interpolation',
						detail: 'genType smoothstep(genType edge0, genType edge1, genType x)',
						range: range,
					},

					// Math functions[17]
					{
						label: 'sin',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'sin(${1:angle})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns sine of angle in radians',
						detail: 'genType sin(genType angle)',
						range: range,
					},
					{
						label: 'cos',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'cos(${1:angle})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns cosine of angle in radians',
						detail: 'genType cos(genType angle)',
						range: range,
					},
					{
						label: 'tan',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'tan(${1:angle})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns tangent of angle in radians',
						detail: 'genType tan(genType angle)',
						range: range,
					},
					{
						label: 'pow',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'pow(${1:base}, ${2:exponent})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns base raised to the power of exponent',
						detail: 'genType pow(genType base, genType exponent)',
						range: range,
					},
					{
						label: 'sqrt',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'sqrt(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns square root of value',
						detail: 'genType sqrt(genType value)',
						range: range,
					},
					{
						label: 'abs',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'abs(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns absolute value',
						detail: 'genType abs(genType value)',
						range: range,
					},
					{
						label: 'floor',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'floor(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns largest integer <= value',
						detail: 'genType floor(genType value)',
						range: range,
					},
					{
						label: 'ceil',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'ceil(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns smallest integer >= value',
						detail: 'genType ceil(genType value)',
						range: range,
					},
					{
						label: 'fract',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'fract(${1:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns fractional part of value',
						detail: 'genType fract(genType value)',
						range: range,
					},
					{
						label: 'mod',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'mod(${1:value}, ${2:divisor})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns value modulo divisor',
						detail: 'genType mod(genType value, genType divisor)',
						range: range,
					},
					{
						label: 'min',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'min(${1:a}, ${2:b})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns minimum of two values',
						detail: 'genType min(genType a, genType b)',
						range: range,
					},
					{
						label: 'max',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'max(${1:a}, ${2:b})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns maximum of two values',
						detail: 'genType max(genType a, genType b)',
						range: range,
					},
					{
						label: 'step',
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: 'step(${1:edge}, ${2:value})',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Returns 0.0 if value < edge, else 1.0',
						detail: 'genType step(genType edge, genType value)',
						range: range,
					},

					// Built-in variables[9]
					{
						label: 'gl_Position',
						kind: monaco.languages.CompletionItemKind.Variable,
						insertText: 'gl_Position',
						documentation: 'Vertex position in clip coordinates',
						detail: 'vec4 gl_Position',
						range: range,
					},
					{
						label: 'gl_FragColor',
						kind: monaco.languages.CompletionItemKind.Variable,
						insertText: 'gl_FragColor',
						documentation: 'Fragment output color',
						detail: 'vec4 gl_FragColor',
						range: range,
					},
					{
						label: 'gl_FragCoord',
						kind: monaco.languages.CompletionItemKind.Variable,
						insertText: 'gl_FragCoord',
						documentation: 'Fragment window coordinates',
						detail: 'vec4 gl_FragCoord',
						range: range,
					},
					{
						label: 'gl_PointSize',
						kind: monaco.languages.CompletionItemKind.Variable,
						insertText: 'gl_PointSize',
						documentation: 'Point size for point primitives',
						detail: 'float gl_PointSize',
						range: range,
					},

					// Storage qualifiers
					{
						label: 'uniform',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'uniform ${1:type} ${2:name};',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Uniform variable declaration',
						detail: 'uniform qualifier',
						range: range,
					},
					{
						label: 'attribute',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'attribute ${1:type} ${2:name};',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Vertex attribute declaration',
						detail: 'attribute qualifier',
						range: range,
					},
					{
						label: 'varying',
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: 'varying ${1:type} ${2:name};',
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Varying variable declaration',
						detail: 'varying qualifier',
						range: range,
					},

					// Common shader templates
					{
						label: 'vertex_main',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: [
							'attribute vec3 position;',
							'uniform mat4 modelViewProjectionMatrix;',
							'',
							'void main() {',
							'    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);',
							'}',
						].join('\n'),
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Basic vertex shader template',
						detail: 'Vertex shader main function',
						range: range,
					},
					{
						label: 'fragment_main',
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: [
							'#ifdef GL_ES',
							'precision mediump float;',
							'#endif',
							'',
							'uniform vec2 u_resolution;',
							'uniform float u_time;',
							'',
							'void main() {',
							'    vec2 st = gl_FragCoord.xy / u_resolution.xy;',
							'    gl_FragColor = vec4(${1:st.x, st.y, 0.0}, 1.0);',
							'}',
						].join('\n'),
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: 'Basic fragment shader template',
						detail: 'Fragment shader main function',
						range: range,
					},
				],
			}
		},
	})
}

export function setupGLSLSyntaxHighlighting(monaco: Monaco) {
	monaco.languages.setMonarchTokensProvider('glsl', {
		tokenizer: {
			root: [
				// Keywords
				[
					/\b(void|float|int|bool|vec2|vec3|vec4|mat2|mat3|mat4|uniform|attribute|varying|if|else|for|while|return|break|continue|discard|precision)\b/,
					'keyword',
				],

				// Types
				[/\b(sampler2D|samplerCube)\b/, 'type'],

				// Numbers
				[/\b\d+\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
				[/\b\d+\b/, 'number'],

				// Strings
				[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

				// Comments
				[/\/\/.*$/, 'comment'],
				[/\/\*/, 'comment', '@comment'],
			],

			comment: [
				[/[^\/*]+/, 'comment'],
				[/\*\//, 'comment', '@pop'],
				[/[\/*]/, 'comment'],
			],

			string: [
				[/[^\\"]+/, 'string'],
				[/\\./, 'string.escape'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
			],
		},
	})
}
