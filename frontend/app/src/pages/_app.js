import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'

const font = Open_Sans({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
      <>
        <style jsx global>{`
            html {
            font-family: ${font.style.fontFamily};
            }
        `}</style>
        <Component {...pageProps} />
        </>
    )
}
