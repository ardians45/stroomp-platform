import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import WalletContextProvider from "@/components/wallet-provider";
import ErrorBoundary from "@/components/error-boundary";
import { ErrorProvider } from "@/contexts/errorContext";
import ClientComponentsWrapper from "@/components/client-components-wrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Stroomp - Decentralized Live Streaming",
  description: "The next generation of live streaming with blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorProvider>
          <WalletContextProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <ClientComponentsWrapper />
          </WalletContextProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
