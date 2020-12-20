
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Reference = require('../models/Reference');
const Article = require('../models/Article');
const User = require('../models/User');


//get LIST of references
router.get('/:articleid', async (req, res) => {
  try {
   const article = await Article.findById(req.params.articleid);


    const references = await Reference.find({article: article})
	.populate("article").then( data => {
	res.json(data);
	});
	
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//GET ALL FOR TESTING
router.get('/', async(req, res) =>{
try{
const reference = await Reference.find();
if (!reference) return res.status(404).json({ msg: 'Reference not found' });
res.json(reference);
}
catch(err){
console.error(err.message); 
res.status(500).send('server error');
}
});

//POST reference
router.post(
  '/:articleid',
  [ [body('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
	const article = await Article.findById(req.params.articleid);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
	console.log(req.body);

    try {
      const newReference = new Reference({
        name,
		article: article, 
      });

      const reference = await newReference.save();

      res.json(reference);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//put by ID
router.put('/:articleid', async (req, res) => {

  const { name } = req.body;
	
  // Build reference object
  const referenceFields = {};
  
  if (name) referenceFields.name = name;

  try {
   const article = await Article.findById(req.params.articleid);
    let reference = await Reference.find({article: article});

    if (!reference) return res.status(404).json({ msg: 'Reference not found' });
//no role verification
    reference = await Reference.findByIdAndUpdate(
      reference[0]._id,
      { $set: referenceFields },
      { new: true }
    );

    res.json(reference);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});



//DELETE
router.delete('/:articleid', async (req, res) => {
  try {
   const article = await Article.findById(req.params.articleid);

    let reference = await Reference.find({article: article});
    if (!reference) return res.status(404).json({ msg: 'Reference not found' });
	//no role verification
    await Reference.findByIdAndRemove(reference._id);
	
    res.json({ msg: 'Reference removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
