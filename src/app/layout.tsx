import Navbar from './components/Navbar';
import Footer from './components/Rodape';
import './globals.css';

export const metadata = {
  title: "LocalStack",
  description: "Sistema de Upload com LocalStack e Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
