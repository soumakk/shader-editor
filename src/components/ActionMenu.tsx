import { useAtom } from 'jotai'
import { primitiveAtom } from '../lib/atoms'
import PlaneIcon from '../icons/PlaneIcon'
import BoxIcon from '../icons/BoxIcon'
import SphereIcon from '../icons/SphereIcon'

export default function ActionMenu() {
	const [activePrimitive, setActivePrimitive] = useAtom(primitiveAtom)
	return (
		<div className="fixed bottom-4 left-1/2 -translate-1/2 z-50">
			<div className="bg-white rounded-full py-3 px-6 flex gap-5">
				<button onClick={() => setActivePrimitive('plane')}>
					<PlaneIcon />
				</button>
				<button onClick={() => setActivePrimitive('box')}>
					<BoxIcon />
				</button>
				<button onClick={() => setActivePrimitive('sphere')}>
					<SphereIcon />
				</button>
				{/* <button onClick={() => setActivePrimitive('suzzane')}>Suzzane</button> */}
			</div>
		</div>
	)
}
