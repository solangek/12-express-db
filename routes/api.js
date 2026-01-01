/*

Route	Method	Functionality
/api/contacts	GET	Retrive all contacts
/api/contacts	POST	Create contact
/api/contacts/:id	PUT	Update the details of a contact
/api/contacts/:id	DELETE	Delete a contact

 */

const express = require('express');
const router = express.Router();
const { showContacts, showContact, addContact, deleteContact, updateContact } = require('../controllers/apicontroller');


/* note the RESTful API design:
GET /api/contacts - Retrieve all contacts
POST /api/contacts - Create a new contact
PUT /api/contacts/:id - Update a contact by ID
DELETE /api/contacts/:id - Delete a contact by ID
GET /api/contacts/:lastName - Retrieve contacts by last name

 examples of what you should NOT do:
GET /api/contacts/all - Retrieve all contacts (not RESTful, use /api/contacts)
GET /api/contacts/create - Create a new contact (not RESTful, use POST /api/contacts)
GET /api/updatecontact - Update a contact (not RESTful, use PUT /api/contacts/:id)

 */

router.get('/contacts', showContacts);
router.get('/contacts/:lastName', showContact);
router.post('/contacts', addContact);
router.delete('/contacts/:id', deleteContact);
router.put('/contacts/:id', updateContact);

module.exports = router;
