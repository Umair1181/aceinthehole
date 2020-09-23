const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Configs = new Schema({
    paypalBusinessEmail:{
        type: String,
    },
    stripePaymentLink: {
        type: String
    },
    superAdminCharges:{
        type: Number
    },
    stripeTranAmountPercentage:{
        type: Number
    },
    transectionFee:{
        type: Number
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model( "tblconfigs", Configs );