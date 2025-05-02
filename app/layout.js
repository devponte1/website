// app/layout.js
import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'My App',
  description: 'Next.js 14 Auth App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
