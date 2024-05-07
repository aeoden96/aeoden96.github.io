import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import { Metadata } from 'next'

// const satisfy = Satisfy({
//   weight: "400",
//   subsets: ["latin"],
// });

// const jakartaSans = PJS({
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'My Hub: Graphics, CS, and React Frontend Development',
  description:
    'Explore the world of graphics, computer science, and React frontend development with Mateo. Get insights, tutorials, and resources to master the art of digital design and code craftsmanship',
  openGraph: {
    title: 'My Hub: Graphics, CS, and React Frontend Development',
    description:
      'Explore the world of graphics, computer science, and React frontend development with Mateo. Get insights, tutorials, and resources to master the art of digital design and code craftsmanship',
    type: 'website',
    url: 'https://mateomartinjak.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
