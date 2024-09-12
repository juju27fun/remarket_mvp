const mongoose = require('mongoose');
const slugify = require('slugify');
const Upload = require('./uploadModel');
// const validator = require('validator');

const categories = [
  'emploi', 'vehicules', 'immobilier', 'location_de_vacances', 'ordinateurs',
  'accessoires_informatique', 'tablettes_liseuses', 'photo_audio_video',
  'telephones_objets_connectes', 'accessoires_telephone_objets_connectes',
  'consoles', 'jeux_video', 'electromenager', 'services_de_reparations_electroniques',
  'ameublement', 'papeterie_fournitures_scolaires', 'arts_de_la_table',
  'decoration', 'linge_de_maison', 'bricolages', 'jardin_plantes',
  'services_de_jardinerie_bricolage', 'equipement_bebe', 'mobilier_enfant',
  'vetements_bebe', 'vetements_enfant', 'vetements_maternite', 'chaussures_enfant',
  'montres_bijoux_enfant', 'accessoires_bagageries_enfant', 'jeux_jouets',
  'baby_sitting', 'vetements', 'chaussures', 'accessoires_bagagerie',
  'montres_bijoux', 'antiquites', 'artistes_musiciens', 'billeterie',
  'collection', 'cd_musique', 'dvd_films', 'instruments_de_musique', 'livres',
  'modelisme', 'vins_gastronomie', 'loisirs_creatifs', 'sport_plein_air',
  'velos', 'equipements_velos', 'animaux', 'accessoires_animaux',
  'animaux_perdus', 'services_aux_animaux', 'materiel_professionnel',
  'services', 'autres'
];


const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sellers: [{
      _id: false, // Ceci désactive la génération automatique de _id
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      quantity: { type: Number, default: 1 }
    }],
    state: { type: String, required: true},
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upload',
      required: true,
    },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: categories
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 1 },
    rating: { type: Number, required: true, default: 5 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

ProductSchema.statics.addItemToProduct = async function(productId, sellerId) {
  const product = await this.findById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }

  // Augmenter countInStock de 1
  product.countInStock += 1;

  // Chercher si le vendeur existe déjà dans la liste des sellers
  const existingSeller = product.sellers.find(s => s.seller.toString() === sellerId.toString());

  if (existingSeller) {
    // Si le vendeur existe, incrémenter sa quantité
    existingSeller.quantity += 1;
  } else {
    // Si le vendeur n'existe pas, l'ajouter à la fin de la liste
    product.sellers.push({
      seller: sellerId,
      quantity: 1
    });
  }

  // Sauvegarder les modifications
  await product.save();

  return product;
};

ProductSchema.statics.removeItemFromProduct = async function(productId, sellerId) {
  const product = await this.findById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }

  // Trouver l'index du vendeur dans la liste
  const sellerIndex = product.sellers.findIndex(s => s.seller.toString() === sellerId.toString());

  if (sellerIndex === -1) {
    throw new Error('Seller not found for this product');
  }

  // Décrémenter la quantité du vendeur
  product.sellers[sellerIndex].quantity -= 1;

  // Si la quantité du vendeur atteint 0, le supprimer de la liste
  if (product.sellers[sellerIndex].quantity <= 0) {
    product.sellers.splice(sellerIndex, 1);
  }

  // Décrémenter le stock total
  product.countInStock = Math.max(0, product.countInStock - 1);

  // Sauvegarder les modifications
  await product.save();

  return product;
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;