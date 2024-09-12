const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel.js');
const User = require('../models/UserModel.js');
const mongoose = require('mongoose');


const getProducts = expressAsyncHandler(async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const name = req.query.name || '';
  const category = req.query.category || '';
  const seller = req.query.seller || '';
  const order = req.query.order || '';
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const sellerFilter = seller ? { seller } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = order === 'lowest' ? { price: 1 } :
    order === 'highest' ? { price: -1 } :
    order === 'toprated' ? { rating: -1 } :
    { _id: -1 };
  
  const filter = {
    ...sellerFilter,
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const count = await Product.countDocuments(filter);
  
  const products = await Product.find(filter)
    .populate('seller', 'seller.name seller.logo')
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  
  res.send({ products, page, pages: Math.ceil(count / pageSize) });
});

const getCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.send(categories);
});

const seedProducts = expressAsyncHandler(async (req, res) => {
  // await Product.remove({});
  const seller = await User.findOne({ isSeller: true });
  if (seller) {
    const products = data.products.map((product) => ({
      ...product,
      seller: seller._id,
    }));
    const createdProducts = await Product.insertMany(products);
    res.send({ createdProducts });
  } else {
    res.status(500).send({ message: 'No seller found. first run /api/users/seed' });
  }
});

const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      state,
      countInStock,
      image // Supposons que l'ID de l'image est envoyé dans la requête
    } = req.body;

    let imageId;
    try {
      imageId = new mongoose.Types.ObjectId(image);
    } catch (error) {
      return res.status(400).send({ message: "L'ID de l'image n'est pas valide" });
    }

    const product = new Product({
      name,
      seller: req.user._id, // On suppose que l'ID de l'utilisateur est disponible dans req.user
      image: imageId,
      brand,
      state,
      category,
      description,
      price,
      countInStock // Optionnel maintenant, sera 0 par défaut si non fourni
    });

    const createdProduct = await product.save();
    res.status(201).send({ message: 'Produit créé', product: createdProduct });
  } catch (error) {
    if (error.code === 11000) { // Code d'erreur MongoDB pour violation de contrainte unique
      res.status(400).send({ message: 'Un produit avec ce nom existe déjà' });
    } else {
      res.status(500).send({ message: 'Erreur lors de la création du produit', error: error.message });
    }
  }
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  
  if (product) {
    // Liste des champs modifiables
    const updatableFields = ['name', 'price', 'image', 'category', 'brand', 'countInStock', 'description'];
    
    // Mettre à jour seulement les champs présents dans req.body
    updatableFields.forEach(field => {
      if (field in req.body) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.send({ message: 'Product Updated', product: updatedProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.send({ message: 'Product Deleted', product: product });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const createReview = expressAsyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      return res.status(400).send({ message: 'You already submitted a review' });
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});


const addItemToProductHandler = async (req, res) => {
  try {
    const productId = req.params.id; // Supposons que l'ID du produit soit passé dans les paramètres de la route
    const sellerId = req.user._id; // L'ID du vendeur actuel

    const updatedProduct = await Product.addItemToProduct(productId, sellerId);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeItemFromProductHandler = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id; // Ou obtenez-le d'une autre manière appropriée

    const updatedProduct = await Product.removeItemFromProduct(productId, sellerId);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getCategories,
  seedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  addItemToProductHandler,
  removeItemFromProductHandler,
};
