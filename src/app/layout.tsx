import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import Script from "next/script";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cal Hacks Portal",
  description: "Apply, review, and manage Cal Hacks applications.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `}
        </Script>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
