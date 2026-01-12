'use strict';
const sequelize = require('./index');
const { DataTypes } = require('sequelize');
const Order = require('./order');

/**
 * Contact model representing a contact in the database
 * Contains personal information and validation rules
 */
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'First name must be less than 50 characters'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name cannot be empty'
      },
      isAlpha: {
        msg: 'Last name must contain only letters'
      },
      len: {
        args: [1, 50],
        msg: 'Last name must be between 1 and 50 characters'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: {
        msg: 'Phone must contain only numbers'
      },
      len: {
        args: [0, 20],
        msg: 'Phone number must be less than 20 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      msg: 'Email address already exists'
    },
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      }
    }
  }
}, {
  modelName: 'Contact',
  tableName: 'Contacts',
  paranoid: true, // Enables soft delete (adds deletedAt column)
  timestamps: true // Adds createdAt and updatedAt
});

// Define relationships
Contact.hasMany(Order, {
  foreignKey: 'contactId',
  as: 'orders'
});

Order.belongsTo(Contact, {
  foreignKey: 'contactId',
  as: 'contact'
});

module.exports = { Contact, Order };

