const express = require('express');
const Item = require('../models/item');
const router = express.Router();

router.get(`/`, async (req, res) =>{
   const itemList = await Item.find();
   if(!itemList){
    res.status(500).json({success: false})
   }
        
    
    res.send(itemList);
})

router.post(`/`, (req, res) =>{
    const item = new Item({
   
        name: req.body.name,
        image: req.body.image,//`${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        nbrbed: req.body.nbrbed,
        nbrbr: req.body.nbrbr,
        images: req.body.images,
        telephone: req.body.telephone,
        desc: req.body.desc
    })

    item.save().then((createdItem=>{
        res.status(201).json(createdItem)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })

    
})



module.exports = router;
