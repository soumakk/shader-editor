import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, ThreeElement, useFrame } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import useDebounce from '../lib/useDebounce'
import { defaultFragmentShader, defaultVertexShader } from '../lib/defaultShader'

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

	return (
		<mesh>
			<planeGeometry args={[2, 2, 100, 100]} />
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
			<Canvas style={{ height: '100%' }} camera={{ position: [0, 0, 4], fov: 55 }}>
				<ShaderMesh fragmentShader={debouncedFragment} vertexShader={debouncedVertex} />
				<OrbitControls />
			</Canvas>
		</div>
	)
}

export default ShaderPreview
