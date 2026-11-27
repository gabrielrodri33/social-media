import React, {useEffect, useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, NexoraLogo} from './brand';

// Teste 3D (Three.js): selo metálico "BLACK FRIDAY · 80% OFF" girando, reflexo de ambiente, varredura de luz e partículas.
// O LOGO não entra no 3D: NexoraLogo plano, sobreposto em HTML (regra da marca).

export type Seal3DProps = {top: string; bottom: string};

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const font = new FontLoader().parse(fontJson as unknown as Parameters<FontLoader['parse']>[0]);

// Mapa de ambiente procedural (sem download): dá o reflexo metálico.
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => { tex.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
};

const Text3D: React.FC<{text: string; size: number; y: number; color: string; emissive?: number}> = ({text, size, y, color, emissive = 0}) => {
  const geo = useMemo(() => {
    const g = new TextGeometry(text, {font, size, depth: size * 0.18, curveSegments: 6, bevelEnabled: true, bevelThickness: size * 0.03, bevelSize: size * 0.02, bevelSegments: 3});
    g.computeBoundingBox();
    const b = g.boundingBox!;
    g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
    return g;
  }, [text, size]);
  return (
    <mesh geometry={geo} position={[0, y, 0.2]}>
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.25} emissive={color} emissiveIntensity={emissive} />
    </mesh>
  );
};

const Coin: React.FC<Seal3DProps> = ({top, bottom}) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 45], [0, 1], {...cl, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const rotY = interpolate(enter, [0, 1], [-Math.PI * 3, 0]) + Math.sin(f / 22) * 0.38 * enter;
  const z = interpolate(enter, [0, 1], [-8, 0]);
  const yFloat = Math.sin(f / 28) * 0.08;
  const words = top.split(' ');
  return (
    <group position={[0, yFloat, z]} rotation={[0.2 + Math.sin(f / 30) * 0.05, rotY, 0]}>
      {/* corpo do selo: metal escovado */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.34, 128]} />
        <meshStandardMaterial color="#c8d4e4" metalness={1} roughness={0.22} />
      </mesh>
      {/* aro */}
      <mesh position={[0, 0, 0.17]}>
        <torusGeometry args={[2.18, 0.09, 24, 160]} />
        <meshStandardMaterial color="#eef4ff" metalness={1} roughness={0.12} />
      </mesh>
      {/* face interna azul-marinho */}
      <mesh position={[0, 0, 0.175]}>
        <circleGeometry args={[2.05, 128]} />
        <meshStandardMaterial color="#071a33" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* anel ciano fino */}
      <mesh position={[0, 0, 0.18]}>
        <ringGeometry args={[1.88, 1.93, 128]} />
        <meshStandardMaterial color={C.cyan} emissive={C.cyan} emissiveIntensity={1.2} />
      </mesh>
      <Text3D text={words[0] ?? ''} size={0.42} y={0.78} color="#ffffff" emissive={0.15} />
      <Text3D text={words.slice(1).join(' ')} size={0.42} y={0.22} color="#ffffff" emissive={0.15} />
      <mesh position={[0, -0.2, 0.19]}>
        <planeGeometry args={[2.2, 0.035]} />
        <meshStandardMaterial color={C.cyan} emissive={C.cyan} emissiveIntensity={1.2} />
      </mesh>
      <Text3D text={bottom} size={0.5} y={-0.78} color={C.cyan} emissive={0.9} />
    </group>
  );
};

const Particles: React.FC = () => {
  const f = useCurrentFrame();
  const N = 260;
  const base = useMemo(() => new Array(N).fill(0).map((_, i) => [(random(`x${i}`) - 0.5) * 12, (random(`y${i}`) - 0.5) * 18, -random(`z${i}`) * 6 - 1, 0.3 + random(`s${i}`)]), []);
  const positions = useMemo(() => new Float32Array(N * 3), []);
  base.forEach(([x, y, z, s], i) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = ((y + f * 0.02 * s + 9) % 18) - 9;
    positions[i * 3 + 2] = z;
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={N} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={C.cyan} size={0.08} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

const Scene: React.FC<Seal3DProps> = (p) => {
  const f = useCurrentFrame();
  // varredura de luz que passa pela superfície metálica
  const sweepX = interpolate(f, [55, 105], [-6, 6], cl);
  return (
    <>
      <Env />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 6, 6]} intensity={1.4} />
      <pointLight position={[sweepX, 1.5, 3.5]} intensity={45} distance={12} color="#ffffff" />
      <pointLight position={[0, 0, -2.5]} intensity={80} distance={10} color="#1f8bff" />
      <Coin {...p} />
      <Particles />
    </>
  );
};

export const Seal3D: React.FC<Seal3DProps> = (p) => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#02050c'}}>
      {/* brilho azul atrás do selo (HTML, barato) */}
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1300, height: 1300, transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(31,139,255,0.45) 0%, rgba(0,200,232,0.12) 40%, transparent 68%)',
        opacity: interpolate(f, [10, 45], [0, 1], cl)}} />
      <ThreeCanvas width={width} height={height} camera={{fov: 32, position: [0, 0, 19]}} gl={{alpha: true, antialias: true}}>
        <Scene {...p} />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: SAFE.story.top, left: SAFE.story.x}}>
        <NexoraLogo variant="logo" theme="dark" height={84} />
      </div>
    </AbsoluteFill>
  );
};
