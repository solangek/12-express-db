'use strict';
const sequelize = require('./index');
const { DataTypes } = require('sequelize');

/**
 * Order model representing an order in the database
 * Demonstrates custom validation and associations with Contact model
 */
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    orderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1.0,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Order amount must be positive'
            }
        }
    },
    orderStatus: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    referenceNumber: {
        type: DataTypes.STRING,
        unique: {
            msg: 'Reference number already exists'
        },
        allowNull: true
    }
}, {
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
    validate: {
        // Custom validation: prevent duplicate orders for same contact on same date
        async noDuplicateOrderForContactOnSameDate() {
            if (!this.contactId || !this.orderDate) {
                return;
            }

            const existingOrder = await Order.findOne({
                where: {
                    contactId: this.contactId,
                    orderDate: this.orderDate,
                    id: { [sequelize.Sequelize.Op.ne]: this.id } // Exclude current order when updating
                }
            });

            if (existingOrder) {
                throw new Error('An order for this contact on the same date already exists');
            }
        }
    }
});

module.exports = Order;

