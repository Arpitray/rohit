
import "./globals.css";
import Landing from "./Landing";
import Home from "./page";
import About from "./About";
import LenisProvider from './components/LenisProvider'
import Project from "./components/Project";


export default function RootLayout() {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden`}
      >
        <LenisProvider>
          <Home />
          <About />
          <Project />
        </LenisProvider>
      </body>
    </html>
  );
}
