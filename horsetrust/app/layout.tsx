import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond} from "next/font/google";
import "./globals.css";
import NavbarContainer from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const cormorantSans = Cormorant_Garamond({
  variable: "--font-cormorant-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Horse Trust",
  description: "Marketplace de caballos verificados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratSans.variable} ${cormorantSans.variable} antialiased font-sans bg-black text-[var(--color-cream)] overflow-x-hidden`}
      >
            <NavbarContainer/>
            <main className="pt-[80px]">
                {children}
            </main>
            <Footer/>
      </body>
    </html>
  );
}
