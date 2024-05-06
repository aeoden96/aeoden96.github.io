import type { Metadata } from "next";
import { Satisfy, Plus_Jakarta_Sans as PJS } from "next/font/google";

import "./globals.css";

const satisfy = Satisfy({
  weight: "400",
  subsets: ["latin"],
});

const jakartaSans = PJS({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Hub: Graphics, CS, and React Frontend Development",
  description:
    "Explore the world of graphics, computer science, and React frontend development with Mateo. Get insights, tutorials, and resources to master the art of digital design and code craftsmanship",
  openGraph: {
    title: "My Hub: Graphics, CS, and React Frontend Development",
    description:
      "Explore the world of graphics, computer science, and React frontend development with Mateo. Get insights, tutorials, and resources to master the art of digital design and code craftsmanship",
    type: "website",
    url: "https://mateomartinjak.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} ${satisfy.className} `}>
        {children}
      </body>
    </html>
  );
}
