
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Article = require('../models/Article');
const User = require('../models/User');
const upload =require('../middleware/filestorage');

//-----------image upload --------------------



//--------------------------------------------

//get searched string
router.get('/search', async (req, res) => {
  try {
  console.log("i am in");
	const searchinput= req.query.name;
	const articles = await Article.find({title:{$regex:
	searchinput, $options: '$i'}});
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//get LIST of articles
router.get('/all', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/recent', async (req, res) => {
  try {
    const articles = await Article.find().sort({ _id: -1 }).limit(2);
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//get one of articles
router.get('/:id', async (req, res) => {
  try {
    const articles = await Article.findById(req.params.id);
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/search', 
  [ [body('search', 'You have not inputed a keyword').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
	try {
	const {search} = req.body;
	
	//res.json(search);
	res.redirect(301, 'search?name=' +search );
   
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);



router.get('/original', async (req, res) => {

  try {

	const searchinput= req.query.name;
	const articles = await Article.find({title:{$regex:
	searchinput, $options: '$i'}});
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/articles
// @desc    Create a Article
// @access  Private
// post one article

//POST article
router.post(
  '/', upload.single('file'),
  [ [body('title', 'Title is required').not().isEmpty()]],
  async (req, res, next) => {
  
  if(!req.file){
	return res.status(500).send({message: 'Upload fail'});
	}
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
	
	

    const { title, lastedited } = req.body;

	//url= req.protocol + "://" + req.get("host");
	//imagePath = url + "/storage/images/" + req.file.filename;
	imagePath = "/storage/images/"+req.file.filename;
    try {
      const newArticle = new Article({
        title,
		lastedited,
		imagepath: imagePath
      });

      const article = await newArticle.save();

      res.json(article);
	  next;
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


//put by ID
router.put('/:id', async (req, res) => {
console.log("i am in");
  const { title, lastedited } = req.body;
	
  // Build article object
  const articleFields = {};
  if (title) articleFields.title = title;
  if (lastedited) articleFields.lastedited = lastedited;

  try {
    let article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ msg: 'Article not found' });
//no role verification
    article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: articleFields },
      { new: true }
    );

    res.json(article);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});



//get LIST of articles
router.get('/this', async (req, res) => {


  try {

    const articles = await Article.find().sort({ _id: -1 }).limit(2);

    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



router.delete('/:id', async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
	//no role verification
    await Article.findByIdAndRemove(req.params.id);
	
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
