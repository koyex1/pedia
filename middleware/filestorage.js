const multer = require('multer');

var storage = multer.diskStorage({
destination: (req, file, cb) => { cb(null, './front/src/assets/storage/images');},
   filename: (req, file, cb) => {
			 console.log(file);
			 var filetype ='';
			 if(file.mimetype =='image/gif'){
				filetype ='gif';
			 }
			 if(file.mimetype =='image/png'){
				filetype ='png';
			 }
			 if(file.mimetype =='image/jpg'){
				filetype ='jpg';
			 }
			 if(file.mimetype =='image/jpeg'){
				filetype ='jpeg';
			 }
			 cb(null, 'photo' + Date.now() + '.' + filetype);
			 }

});
var upload = multer({storage: storage});

module.exports = upload;