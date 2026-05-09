import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { Vector2 } from 'three'

// Module-level to avoid per-render allocation
const CA_OFFSET = new Vector2(0.002, 0.002)

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      {/* Focus at camera near plane — keeps desk sharp, softens far distance */}
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <ChromaticAberration offset={CA_OFFSET} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.025} />
    </EffectComposer>
  )
}
