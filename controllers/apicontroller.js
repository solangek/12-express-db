const {Contact} = require("../models/contact");

const showContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        return res.send(contacts);
    } catch (err) {
        console.log('There was an error querying contacts', JSON.stringify(err))
        err.error = 1; // some error code for client side
        return res.status(400).send(err) // send the error to the client
    }

}
const showContact = (req, res) => {
    return Contact.findAll({where: {lastName: req.params.lastName}})
        .then((contacts) => res.send(contacts))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.status(400).send(err)
        });
}

const addContact = (req, res) => {
    const { firstName, lastName, phone } = req.body
    return Contact.create({ firstName, lastName, phone })
        .then((contact) => res.status(201).send(contact))
        .catch((err) => {
            console.log('*** error creating a contact', JSON.stringify(err))
            return res.status(400).send(err)
        })
}

const deleteContact = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const contact = await Contact.findByPk(id);
        await contact.destroy({ force: true });
        return res.status(204).send();
    } catch (err) {
        console.log('***Error deleting contact', JSON.stringify(err))
        return res.status(400).send(err)
    }
}

const updateContact = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const contact = await Contact.findByPk(id);
        const { firstName, lastName, phone } = req.body
        await contact.update({ firstName, lastName, phone });
        return res.send(contact);
    } catch (err) {
        console.log('***Error updating contact', JSON.stringify(err))
        return res.status(400).send(err)
    }
}


module.exports = { showContacts, showContact, addContact, deleteContact, updateContact };
