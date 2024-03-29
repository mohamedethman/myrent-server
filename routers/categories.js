const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    if (req.query.rent == '1') {
        filter = {  _id: {$in:['62e6c6bf7a1516d10d81f8b1','62e6c6bf7a1516d10d81f8b3','62e6c6bf7a1516d10d81f8b5']} }
    }
    if (req.query.rent == '0') {
        filter = {  _id: {$nin:['62e6c6bf7a1516d10d81f8b1','62e6c6bf7a1516d10d81f8b3','62e6c6bf7a1516d10d81f8b5']} }
    }
    if (!req.query.rent) {
        filter = {}
    }
    
    const categoryList = await Category.find(filter);

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    res.status(200).send(category);
})



router.post('/', async (req,res)=>{
    let category = new Category({
        name: req.body.name,

    })
    category = await category.save();

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})


router.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            
        },
        { new: true}
    )

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;