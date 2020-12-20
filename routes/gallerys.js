
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Gallery = require('../models/Gallery');
const Subtopic = require('../models/Subtopic');
const User = require('../models/User');
const upload = require('../middleware/filestorage');


//get LIST of gallerys
router.get('/:subtopicid', async (req, res) => {
  try {
  console.log("IN ");
	
   const subtopic = await Subtopic.findById(req.params.subtopicid);


    const gallerys = await Gallery.find({subtopic: subtopic})
	.populate("subtopic").then( data => {
	res.json(data);
	});
	
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//POST gallery
router.post(
  '/:subtopicid', upload.single('file'),
  async (req, res) => {
	const subtopic = await Subtopic.findById(req.params.subtopicid);
	if(!req.file){
	return res.status(500).send({message: 'Upload fail'});
	}  
	imagePath = "storage/images/" + req.file.filename;
	console.log(imagePath);
    try {
	
      const newGallery = new Gallery({
        imagepath: imagePath,
		subtopic: subtopic, 
      });

      const gallery = await newGallery.save();

      res.json(gallery);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//put by ID
router.put('/:id', async (req, res) => {

  const { image, description } = req.body;
	
  // Build gallery object
  const galleryFields = {};
  if (image) galleryFields.image = image;
  if (description) galleryFields.description = description;

  try {
    let gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ msg: 'Gallery not found' });
//no role verification
    gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: galleryFields },
      { new: true }
    );

    res.json(gallery);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async(req, res) =>{
try{
const gallery = await Gallery.find();
if (!gallery) return res.status(404).json({ msg: 'Gallery not found' });
res.json(gallery);
}
catch(err){
console.error(err.message); 
res.status(500).send('server error');
}
});
//DELETE
router.delete('/:id', async (req, res) => {
  try {
    let gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ msg: 'Gallery not found' });
	//no role verification
    await Gallery.findByIdAndRemove(req.params.id);
	
    res.json({ msg: 'Gallery removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
