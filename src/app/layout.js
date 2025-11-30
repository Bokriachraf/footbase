import '../styles/globals.css'
import Providers from './Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Notifications Toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ⭐ On importe le nouveau wrapper client
import ClientWrapper from './ClientWrapper'

export const metadata = {
  title: {
    default: 'footbase',
    template: '%s | footbase',
  },
  description: 'Centre de foot',
  other: {
    "google-site-verification": "Bj242K2ybb67aL2y-SBsxH6f0yMNX5VRMl0NGaglJyE",
  },
  keywords: 'footbase, foot, conformité',
  robots: 'index, follow',
  authors: [{ name: 'Votre Nom ou Entreprise' }],
  openGraph: {
    title: 'footbase - foot',
    siteName: 'footbase',
    description: 'Centre de foot',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://footbase.vercel.app/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {/* 🔥 Le wrapper client qui gère les sockets et Redux */}
          <ClientWrapper>
            <Navbar />

            <main className="min-h-screen">
              {children}
            </main>

            {/* <Footer /> */}

            <ToastContainer
              position="top-center"
              autoClose={10000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  )
}
