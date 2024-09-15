// remarket_frontend/src/App.js
import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // You can run any client-side code here if needed
    console.log("App Component Loaded");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
