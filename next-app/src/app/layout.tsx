import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from '@/components/error-boundary';
import { ClientErrorSetup } from '@/components/client-error-setup';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "School Management System",
    template: "%s | School Management System"
  },
  description: "Modern multi-tenant school management system for comprehensive academic administration",
  keywords: ["school", "management", "education", "students", "teachers", "grades", "reports"],
  authors: [{name: "School Management Team"}],
  creator: "School Management System",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schoolms.com",
    title: "School Management System",
    description: "Modern multi-tenant school management system",
    siteName: "School Management System",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Management System",
    description: "Modern multi-tenant school management system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ClientErrorSetup />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
