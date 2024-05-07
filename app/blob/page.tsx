'use client'

import { Bounds, Environment, MarchingCubes } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import dynamic from 'next/dynamic'

const Blob = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Blob), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const MetaBall = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.MetaBall), { ssr: false })
const Pointer = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Pointer), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Next + React Three Fiber</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Next 3D Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div>
      </div>

      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        {/* <Blob />
        <Common /> */}
        <Physics gravity={[0, 2, 0]}>
          <MarchingCubes resolution={40} maxPolyCount={20000} enableUvs={false} enableColors>
            <meshStandardMaterial vertexColors roughness={0} />
            <MetaBall color='indianred' position={[1, 1, 0.5]} />
            <MetaBall color='skyblue' position={[-1, -1, -0.5]} />
            <MetaBall color='teal' position={[2, 2, 0.5]} />
            <MetaBall color='orange' position={[-2, -2, -0.5]} />
            <MetaBall color='hotpink' position={[3, 3, 0.5]} />
            <MetaBall color='aquamarine' position={[-3, -3, -0.5]} />
            <Pointer />
          </MarchingCubes>
        </Physics>
        <Environment files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr' />
        {/* Zoom to fit a 1/1/1 box to match the marching cubes */}
        <Bounds fit clip observe margin={1}>
          <mesh visible={false}>
            <boxGeometry />
          </mesh>
        </Bounds>
      </View>
    </>
  )
}
