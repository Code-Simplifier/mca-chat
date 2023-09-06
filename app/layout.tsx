import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/components/providers/modal-provider";

export const metadata: Metadata = {
  title: "MCA Chat",
  description: "Owned by Techmind Research",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-full">
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
