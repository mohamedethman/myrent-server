const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const { Image } = require('../models/image');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('../utile/cloudinary')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    // localhost:3000/api/v1/products?categories=2342342,234234
    let filter = {};
    if (req.query.rent == '1') {
        filter = { category: {$in:['62e6c6bf7a1516d10d81f8b1','62e6c6bf7a1516d10d81f8b3','62e6c6bf7a1516d10d81f8b5']} }
    }
    if (req.query.rent == '0') {
        filter = { category: {$nin:['62e6c6bf7a1516d10d81f8b1','62e6c6bf7a1516d10d81f8b3','62e6c6bf7a1516d10d81f8b5']} }
    }
    if (!req.query.rent) {
        filter = {}
    }
    const images = await Image.find({})
    let productList = await Product.find(filter).populate('category');
    productList = productList.map((p) => {
        let new_images = []
        images.map((i) => {
            if (p._id.toString() === i.product.toString()) new_images.push(i.url)
        }
        )
        p.images = new_images
        return p
    })
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) => {
    let product = await Product.findById(req.params.id).populate('category');
    const images = await Image.find({ product: req.params.id });
    product.images = images.map((i) => i.url)

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    // const file = req.file;
    // if (!file) return res.status(400).send('No image in the request');



    // const fileName = req.file.filename
    // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const result = await cloudinary.uploader.upload(req.file.path);
    let product = new Product({
        name: req.body.name,
        // image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        image: result.secure_url,
        desc: req.body.desc,
        nbrbed: req.body.nbrbed,
        nbrbr: req.body.nbrbr,
        space: req.body.space,
        price: req.body.price,
        telephone: req.body.telephone,
        category: req.body.category,
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            desc: req.body.desc,
            nbrbed: req.body.nbrbed,
            nbrbr: req.body.nbrbr,
			space: req.body.space,
            price: req.body.price,
            telephone: req.body.telephone,
            category: req.body.category,
        },
        { new: true }
    )

    if (!product)
        return res.status(500).send('the product cannot be updated!')

    res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    });
})

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send(products);
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.fileName}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    }
);
module.exports = router;