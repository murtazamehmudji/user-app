var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(expressValidator());  //this line to be addded
var index_controller = require('../controllers/index');

router.get('/', index_controller.get_signup_page);

router.post('/', index_controller.post_signup_page);

router.get('/list', index_controller.get_list_page);

router.get('/edit/:id', index_controller.get_edit_page);

router.post('/edit/:id', index_controller.post_edit_page);

router.get('/delete/:id',index_controller.get_delete_page);

module.exports = router;
