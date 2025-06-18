export interface IFile {
	language: string
	name: string
	value: string
}

export type IFiles = Record<string, IFile>
