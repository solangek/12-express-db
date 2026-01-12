const Sequelize = require('sequelize');
const { Contact } = require("../models/contact");

/**
 * Retrieve all contacts from the database
 */
const showContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        return res.json(contacts);
    } catch (err) {
        console.error('Error retrieving contacts:', err);
        return res.status(500).json({
            error: 'Failed to retrieve contacts',
            message: err.message
        });
    }
}

/**
 * Retrieve contacts by last name
 */
const showContact = async (req, res) => {
    try {
        const { lastName } = req.params;

        if (!lastName || !lastName.trim()) {
            return res.status(400).json({
                error: 'Last name parameter is required'
            });
        }

        const contacts = await Contact.findAll({
            where: { lastName }
        });

        if (contacts.length === 0) {
            return res.status(404).json({
                message: `No contacts found with last name: ${lastName}`
            });
        }

        return res.json(contacts);
    } catch (err) {
        console.error('Error querying contacts:', err);
        return res.status(500).json({
            error: 'Failed to query contacts',
            message: err.message
        });
    }
}

/**
 * Create a new contact
 */
const addContact = async (req, res) => {
    try {
        const { firstName, lastName, phone, email } = req.body;

        // Validate required fields
        if (!lastName || !lastName.trim()) {
            return res.status(400).json({
                error: 'Last name is required'
            });
        }

        const contact = await Contact.create({
            firstName,
            lastName,
            phone,
            email
        });

        return res.status(201).json(contact);
    } catch (err) {
        console.error('Error creating contact:', err);

        if (err instanceof Sequelize.ValidationError) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        if (err instanceof Sequelize.UniqueConstraintError) {
            return res.status(409).json({
                error: 'A contact with this email already exists'
            });
        }

        return res.status(500).json({
            error: 'Failed to create contact',
            message: err.message
        });
    }
}

/**
 * Delete a contact by ID
 */
const deleteContact = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'Valid contact ID is required'
            });
        }

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({
                error: `Contact with ID ${id} not found`
            });
        }

        await contact.destroy({ force: true });

        return res.status(204).send();
    } catch (err) {
        console.error('Error deleting contact:', err);
        return res.status(500).json({
            error: 'Failed to delete contact',
            message: err.message
        });
    }
}

/**
 * Update a contact by ID
 */
const updateContact = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { firstName, lastName, phone, email } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'Valid contact ID is required'
            });
        }

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({
                error: `Contact with ID ${id} not found`
            });
        }

        // Update only provided fields
        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;

        await contact.update(updateData);

        return res.json(contact);
    } catch (err) {
        console.error('Error updating contact:', err);

        if (err instanceof Sequelize.ValidationError) {
            return res.status(400).json({
                error: 'Validation error',
                details: err.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        if (err instanceof Sequelize.UniqueConstraintError) {
            return res.status(409).json({
                error: 'A contact with this email already exists'
            });
        }

        return res.status(500).json({
            error: 'Failed to update contact',
            message: err.message
        });
    }
}


module.exports = { showContacts, showContact, addContact, deleteContact, updateContact };
