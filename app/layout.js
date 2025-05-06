// app/layout.js
import './globals.css';
import Header from './components/Header';

export const metadata = {
  description: 'a Next.js web app',  // You can keep the description if needed
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
