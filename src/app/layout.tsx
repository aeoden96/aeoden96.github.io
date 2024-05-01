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
  title: "Modex | Hrvatski tekstilni proizvodi",
  description:
    "Maloprodaja dječje,muške i ženske odjeće hrvatskih i ostalih proizvođača po pristupačnim cijenama.",
  openGraph: {
    title: "Modex | Hrvatski tekstilni proizvodi",
    description:
      "Maloprodaja dječje,muške i ženske odjeće hrvatskih i ostalih proizvođača po pristupačnim cijenama.",
    type: "website",
    url: "https://modex.hr",
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
