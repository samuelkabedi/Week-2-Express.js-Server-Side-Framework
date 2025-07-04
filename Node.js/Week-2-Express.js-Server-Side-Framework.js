// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validateProduct } = require('../middleware/validateProduct');
const { NotFoundError } = require('../utils/errors');

// GET /api/products
router.get('/', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', validateProduct, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// PUT /api/products/:id
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.status(204).send();
    } 
    catch (err) {}
    next(err);
    });

    
    
