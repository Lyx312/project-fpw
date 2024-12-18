import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-next-app"
        />
        <link rel="icon" href="./assets/images/logo.png" />
        <title>Freelance Hub</title>
      </head>
      <body style={{ margin: 0 }}>
        <AppRouterCacheProvider>
          {/* <ThemeProvider theme={theme}> */}
          <Providers>{children}</Providers>
          {/* </ThemeProvider> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
