const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  optionsSuccessStatus: 200, // Pour les navigateurs qui nécessitent une réponse 204
};

app.use(cors(corsOptions));
const OrderRouter = require('./routers/OrderRouter');
const ProductRouter = require('./routers/ProductRouter');
const UserRouter = require('./routers/UserRouter');
const uploadRouter = require('./routers/uploadRouter');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
// Ajoutez cette ligne si vous avez un dossier d'uploads
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/order', OrderRouter);
app.use('/api/v1/product', ProductRouter);
app.use('/api/v1/users', UserRouter);


// Configuration pour PayPal et Google API (si nécessaire)
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
  );
}

// Middleware de gestion d'erreurs globale
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

module.exports = app;