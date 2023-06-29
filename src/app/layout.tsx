import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stick It Up",
  description: "Sticker and printing needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`flex flex-col h-screen ${inter.className}`}>
        <Navbar />
        <div className="flex justify-center w-full grow">
          {children}
        </div>
      </body>
    </html>
  );
}
