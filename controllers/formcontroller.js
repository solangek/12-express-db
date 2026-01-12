const Sequelize = require("sequelize");
const { Contact } = require('../models/contact');

const handleForm = async (req, res) => {

    try {
        const { firstName, lastName, phone, email } = req.body;
        await Contact.create({ firstName, lastName, phone, email });
        res.render('added', {message: "The contact was added successfully!"})
    } catch (err) {
        // in principle the client should perform the validation, but we can't trust the client so we need to validate here as well
        // however since this is not expected to happen, we can just return a non user friendly message.
        // or do Extensive error handling if needed:
        if (err instanceof Sequelize.ValidationError) {
            res.render('added', {message: `Invalid input: ${err}`});
        } else if (err instanceof Sequelize.DatabaseError) {
            res.render('added', {message: `Database error: ${err}`});
        } else {
            res.render('added', {message: `Unexpected error: ${err}`});
        }
    }
}

const showForm = (req, res) => {
    // Redirect to the home page (Post-Redirect-Get pattern)
    // This prevents duplicate submissions when the user refreshes the page
    // Without redirect, refreshing would resubmit the form data
    res.redirect('/');
}

module.exports = { handleForm, showForm };
