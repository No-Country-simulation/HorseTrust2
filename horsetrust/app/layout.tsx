import type { Metadata } from "next";
import { Montserrat} from "next/font/google";
import "./globals.css";
import NavbarContainer from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Providers } from "./providers";

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
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
        className={`${montserratSans.variable} antialiased`}
      >
        <Providers>
            <NavbarContainer/>
            {children}
            <Footer/>
        </Providers>
      </body>
    </html>
  );
}
