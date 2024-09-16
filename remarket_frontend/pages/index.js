// remarket_frontend/pages/index.js

import React from 'react';
import Head from 'next/head';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Link from 'next/link';

const HomePage = () => {
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
          <Link href="/register"><a className="btn">Get Started</a></Link>
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
          <Link href="/register"><a className="btn">Sign Up Now</a></Link>
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
          text-decoration: none;
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