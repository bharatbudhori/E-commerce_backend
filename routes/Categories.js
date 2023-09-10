const express = require('express');
const { fetchAllCategories, createCategory } = require('../controller/Category');

const router = express.Router();

router.get('/', fetchAllCategories);
router.post('/', createCategory);

exports.routes = router;