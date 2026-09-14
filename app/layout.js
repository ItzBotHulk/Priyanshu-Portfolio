import { Poppins } from "next/font/google";
import "./globals.css";
import DynamicBackground from "@/components/DynamicBackground";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata = {
  title: "Portfolio - Priyanshu Prajapati",
  description: "Its a portfolio of Priyanshu, A full stack dev.",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body
        className="overflow-x-hidden antialiased bg-black selection:bg-purple-500/30 text-zinc-100 min-h-screen relative"
        suppressHydrationWarning
      >
        <DynamicBackground />
        {children}
      </body>
    </html>
  );
}
