import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins, Rubik_Mono_One } from 'next/font/google'

const poppins = Poppins({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const rubik_mono = Rubik_Mono_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={`${poppins.variable} ${rubik_mono.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}
