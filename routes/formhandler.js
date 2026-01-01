var express = require('express');
var router = express.Router();
const { handleForm, showForm } = require('../controllers/formcontroller');

/**
 * the goal of this example is to show you how to handle form data
 * using a POST request and how to handle errors
 * This is not an Ajax (SPA) example, it is a traditional form submission
 */
router.post('/add', handleForm);
router.get('/add', showForm);

module.exports = router;
