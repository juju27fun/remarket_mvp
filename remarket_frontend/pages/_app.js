
import '../src/styles/globals.css'; // Adjust the path if needed
import '../src/components/Header';
import '../src/components/Footer';
import '../src/components/navbar';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // You can run any client-side code here if needed
    console.log("App Component Loaded");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;