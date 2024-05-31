import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import StoreProvider from './StoreProvider';

export const metadata = {
  title: 'OBS Frontend Assignment',
  description: 'test frontend developer assignment',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <StoreProvider>
          <MantineProvider theme={theme}>
            {children}
            <Notifications />
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
