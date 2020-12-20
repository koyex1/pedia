
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Subtopic = require('../models/Subtopic');
const Article = require('../models/Article');
const User = require('../models/User');
const Gallery = require('../models/Gallery');



//get LIST of subtopics
router.get('/:articleid', async (req, res) => {
  try {
   const article = await Article.findById(req.params.articleid);


    const subtopics = await Subtopic.find({article: article})
	.populate("article").then( data => {
	res.json(data);
	});
	
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//POST subtopic
router.post(
  '/:articleid',
  [ [body('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
	const article = await Article.findById(req.params.articleid);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
	console.log(req.body);
	//array = [];
	//array.push(req.body);
	
	try {
	//for(var i=0; i<req.body.length; i++){
    const { title, description} = req.body;//[i];array[i];
//console.log(array);
//console.log(array[i].title);
	
    
      const newSubtopic = new Subtopic({
        title,
		description,
		article: article,
      });

      const subtopic = await newSubtopic.save();
	   res.json(subtopic);

	//}

     

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//put by ID
router.put('/:id', async (req, res) => {

  const { title, description } = req.body;
	
  // Build subtopic object
  const subtopicFields = {};
  if (title) subtopicFields.title = title;
  if (description) subtopicFields.description = description;

  try {
    let subtopic = await Subtopic.findById(req.params.id);
    if (!subtopic) return res.status(404).json({ msg: 'Subtopic not found' });
//no role verification
    subtopic = await Subtopic.findByIdAndUpdate(
      req.params.id,
      { $set: subtopicFields },
      { new: true }
    );

    res.json(subtopic);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async(req, res) =>{
try{
const subtopic = await Subtopic.find();
if (!subtopic) return res.status(404).json({ msg: 'Subtopic not found' });
res.json(subtopic);
}
catch(err){
console.error(err.message); 
res.status(500).send('server error');
}
});
//DELETE
router.delete('/:id', async (req, res) => {
  try {
    let subtopic = await Subtopic.findById(req.params.id);
    if (!subtopic) return res.status(404).json({ msg: 'Subtopic not found' });
	//no role verification
    await Subtopic.findByIdAndRemove(req.params.id);
	
    res.json({ msg: 'Subtopic removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
