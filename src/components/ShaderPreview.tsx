import { OrbitControls, shaderMaterial, Stats } from '@react-three/drei'
import { Canvas, extend, ThreeElement, useFrame } from '@react-three/fiber'
import { useAtomValue } from 'jotai'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { primitiveAtom } from '../lib/atoms'
import { defaultFragmentShader, defaultVertexShader } from '../lib/defaultShader'
import useDebounce from '../lib/useDebounce'

const CustomShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_resolution: new THREE.Vector2(),
		u_mouse: new THREE.Vector2(),
	},
	defaultVertexShader,
	defaultFragmentShader
)

declare module '@react-three/fiber' {
	interface ThreeElements {
		customShaderMaterial: ThreeElement<typeof CustomShaderMaterial>
	}
}

extend({ CustomShaderMaterial })

function ShaderMesh({
	fragmentShader,
	vertexShader,
}: {
	fragmentShader: string
	vertexShader: string
}) {
	const activePrimitive = useAtomValue(primitiveAtom)

	const materialRef = useRef<any>(null)
	const [currentShader, setCurrentShader] = React.useState({
		fragment: fragmentShader,
		vertex: vertexShader,
	})

	useEffect(() => {
		if (
			materialRef.current &&
			(fragmentShader !== currentShader.fragment || vertexShader !== currentShader.vertex)
		) {
			materialRef.current.fragmentShader = fragmentShader
			materialRef.current.vertexShader = vertexShader
			materialRef.current.needsUpdate = true
			setCurrentShader({
				fragment: fragmentShader,
				vertex: vertexShader,
			})
		}
	}, [fragmentShader, vertexShader, currentShader.fragment, currentShader.vertex])

	// Animate uniforms
	useFrame(({ clock, size, mouse }) => {
		if (materialRef.current) {
			materialRef.current.u_time = clock.elapsedTime
			materialRef.current.u_resolution = [size.width, size.height]
			materialRef.current.u_mouse = [mouse.x, mouse.y]
		}
	})

	function getPrimitive(type: string) {
		switch (type) {
			case 'plane':
				return <planeGeometry args={[2, 2, 100, 100]} />
			case 'box':
				return <boxGeometry args={[1, 1, 1]} />
			case 'sphere':
				return <sphereGeometry args={[1, 64, 64]} />
			default:
				return <planeGeometry args={[2, 2, 100, 100]} />
		}
	}

	return (
		<mesh>
			{getPrimitive(activePrimitive)}
			<customShaderMaterial ref={materialRef} key={CustomShaderMaterial.key} />
		</mesh>
	)
}

function ShaderPreview({
	fragmentShader,
	vertexShader,
}: {
	fragmentShader: string
	vertexShader: string
}) {
	const debouncedFragment = useDebounce(fragmentShader, 1000)
	const debouncedVertex = useDebounce(vertexShader, 1000)

	return (
		<div className="bg-neutral-900 rounded-lg h-full relative ml-1">
			<Canvas style={{ height: '100%' }} camera={{ position: [0, 0, 4], fov: 50 }}>
				<ShaderMesh fragmentShader={debouncedFragment} vertexShader={debouncedVertex} />
				<OrbitControls />
				<Stats className="stats-panel" />
			</Canvas>
		</div>
	)
}

export default ShaderPreview
