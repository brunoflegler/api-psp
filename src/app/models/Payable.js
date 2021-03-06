'use strict'

module.exports = (sequelize, DataTypes) => {
  const Payable = sequelize.define(
    'Payable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'payment_date'
      },
      fee: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
        field: 'fee'
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'transaction_id'
      },
      status: {
        type: DataTypes.ENUM('paid', 'waiting_funds'),
        allowNull: false,
        field: 'status'
      }
    },

    {
      tableName: 'payables',
      hooks: {
        afterCreate: function (payable, options) {
          if (options.transaction) {
            // Save done within a transaction, wait until transaction is committed to
            // notify listeners the instance has been saved
            options.transaction.afterCommit(() =>
              console.log('commit success payable')
            )
          }
        }
      }
    }
  )

  Payable.associate = models => {
    Payable.belongsTo(models.Transaction, {
      as: 'transaction'
    })
  }

  return Payable
}
