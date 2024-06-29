const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  amount: Number, // Assuming amount is a numeric value
  tcp: Number, // Assuming tcp is a numeric value
  vat: Number, // Assuming vat can be stored as string (e.g., "12%")
  vat_amount: Number, // Assuming vat_amount is a numeric value
  nsp: Number, // Assuming nsp is a numeric value
  miscPercent: Number,
  miscAmount: Number,
  paymentNoMisc: Number
});

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;
