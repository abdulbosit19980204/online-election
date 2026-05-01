import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "VoteSecure — Online Voting Platform",
  description:
    "A secure, transparent, and accessible online voting platform. Cast your vote with confidence using enterprise-grade encryption and real-time results.",
  keywords: ["voting", "election", "secure", "online voting", "democracy"],
  openGraph: {
    title: "VoteSecure — Online Voting Platform",
    description: "Secure, transparent online elections with real-time results",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "glass",
                style: {
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                },
                success: {
                  iconTheme: { primary: "var(--success)", secondary: "white" },
                },
                error: {
                  iconTheme: { primary: "var(--danger)", secondary: "white" },
                },
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
