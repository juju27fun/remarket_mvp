import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { useAuth } from '../src/hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth(); // Custom hook to check authentication and admin status
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect in HomePage triggered');
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      if (!isAuthenticated) {
        console.log('User is not authenticated, redirecting to signin...');
        await router.push('/signin');
      } else {
        console.log('User is authenticated');
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while checking authentication
  }

  return (
    <div>
      <Head>
        <title>Home | Remarket</title>
        <meta name="description" content="Welcome to Remarket, your go-to platform for all your selling needs." />
      </Head>

      <Header />

      <main>
        <section className="hero">
          <h1>Welcome to Remarket</h1>
          <p>Your go-to platform for all your selling needs.</p>
          <Link href="/register" className="btn"> Get Started</Link>
        </section>

        <section className="features">
          <h2>Why Choose Remarket?</h2>
          <div className="feature-cards">
            <div className="card">
              <h3>Easy to Use</h3>
              <p>Detailed description of how easy it is to use our platform.</p>
            </div>
            <div className="card">
              <h3>Secure</h3>
              <p>Detailed description of the security features.</p>
            </div>
            <div className="card">
              <h3>Support</h3>
              <p>Detailed description of the support we offer.</p>
            </div>
          </div>
        </section>

        <section className="call-to-action">
          <h2>Ready to get started?</h2>
          <Link href="/register" className="btn">Sign Up Now</Link>
        </section>

        <section className="signin">
          <h2>Already have an account?</h2>
          <Link href="/signin" className="btn">Sign In</Link>
        </section>

        {isAuthenticated && (
          <>
            <section className="profile">
              <h2>My Account</h2>
              <Link href="/profile" className="btn">Profile</Link>
            </section>

            <section className="orders">
              <h2>My Orders</h2>
              <Link href="/order" className="btn">Orders</Link>
            </section>
          </>
        )}

        <section className="products">
          <h2>Products</h2>
          <Link href="/product" className="btn">All Products</Link>
          <Link href="/product/category" className="btn">Product Categories</Link>
        </section>

        {isAdmin && (
          <section className="admin-products">
            <h2>Admin Products</h2>
            <Link href="/admin/products/index" className="btn">Manage Products</Link>
          </section>
        )}

        <section className="upload">
          <h2>Upload</h2>
          <Link href="/upload" className="btn">Upload Files</Link>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .hero {
          text-align: center;
          padding: 50px 20px;
        }
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        .btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
        }
        .features {
          text-align: center;
          padding: 50px 20px;
          background: #f9f9f9;
        }
        .features h2 {
          margin-bottom: 20px;
        }
        .feature-cards {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 300px;
        }
        .call-to-action {
          text-align: center;
          padding: 50px 20px;
        }
        .call-to-action h2 {
          margin-bottom: 20px;
        }
        .signin, .profile, .orders, .products, .admin-products, .upload {
          text-align: center;
          padding: 50px 20px;
        }
        .signin h2, .profile h2, .orders h2, .products h2, .admin-products h2, .upload h2 {
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .feature-cards {
            flex-direction: column;
            align-items: center;
          }
          .card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
