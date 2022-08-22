const {Image} = require('../models/image');
const express = require('express');
const router = express.Router();
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
    const imageList = await Image.find();

    if (!imageList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(imageList);
})

router.get(`/product/:id`, async (req, res) => {
    const id = req.params.id
    const imageList = await Image.find({product: id});

    if (!imageList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(imageList);
})

router.get('/:id', async (req, res) => {
    const image = await Image.findById(req.params.id);

    if (!image) {
        res.status(500).json({ message: 'The image with the given ID was not found.' })
    }
    res.status(200).send(image);
})



router.post('/', uploadOptions.single('url'), async (req, res) => {
    // const file = req.file;
    // if (!file) return res.status(400).send('No image in the request');
    // const fileName = req.file.filename
    // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const result = await cloudinary.uploader.upload(req.file.path);
    let image = new Image({
        // url: `${basePath}${fileName}`,
        url: result.secure_url,
        product: req.body.product,

    })
    image = await image.save();

    if (!image)
        return res.status(400).send('the image cannot be created!')

    res.send(image);
})


// router.put('/:id',async (req, res)=> {
//     const category = await Category.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,

//         },
//         { new: true}
//     )

//     if(!category)
//     return res.status(400).send('the category cannot be created!')

//     res.send(category);
// })

// router.delete('/:id', (req, res)=>{
//     Category.findByIdAndRemove(req.params.id).then(category =>{
//         if(category) {
//             return res.status(200).json({success: true, message: 'the category is deleted!'})
//         } else {
//             return res.status(404).json({success: false , message: "category not found!"})
//         }
//     }).catch(err=>{
//        return res.status(500).json({success: false, error: err}) 
//     })
// })

router.delete('/product/:id', (req, res)=>{
    Image.deleteMany({product: req.params.id}).then(image =>{
        if(image) {
            return res.status(200).json({success: true, message: 'the image is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "image not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


module.exports = router;