// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // wrap SessionProvider here
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskPal",
  description: "Task management app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
