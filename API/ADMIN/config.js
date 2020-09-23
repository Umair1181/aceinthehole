const Router = require("express").Router();

const { Configs } = require("../../MODELS");






Router.post( "/add-update", ( req, res ) => {
    const { data } = req.body;
    let eMessage = false;
    if( data === "" || data === undefined ){
        eMessage = "Invalid Data";
    }else{
        eMessage = false;
    }
    if( eMessage === false ){
        Configs.findOne()
        .then(foundConfig => {
            let newConfig = "";
            if( foundConfig !== null ){
                newConfig = foundConfig;
                // return res.json({ msg: "Configurations", configs: foundConfig,  success: true }).status( 200 );
            }else{
                newConfig  = new Configs({});
            }    
                if(  data.paypalBusinessEmail !== "" &&  data.paypalBusinessEmail !== undefined )
                {
                    newConfig.paypalBusinessEmail = data.paypalBusinessEmail;
                }
                if(  data.stripePaymentLink !== "" &&  data.stripePaymentLink !== undefined )
                {
                    newConfig.stripePaymentLink = data.stripePaymentLink;
                }
                if(  data.superAdminCharges !== "" &&  data.superAdminCharges !== undefined )
                {
                    newConfig.superAdminCharges = data.superAdminCharges;
                }
                if(  data.stripeTranAmountPercentage !== "" &&  data.stripeTranAmountPercentage !== undefined )
                {
                    newConfig.stripeTranAmountPercentage = data.stripeTranAmountPercentage;
                }
                if(  data.transectionFee !== "" &&  data.transectionFee !== undefined )
                {
                    newConfig.transectionFee = data.transectionFee;
                }
                newConfig.save()
                .then( sConfig => {
                    return res.json({ msg: "Configuration Added",config: sConfig, success: true }).status( 200 );
                } )
                .catch( err=> {
                    return res.json({ msg: "Catch Error In Config Update", success: false }).status( 500 );
                } )
                // return res.json({ msg: "No Configuration Found", success: false }).status( 500 );
            
        })
        .catch( err => {
            return res.json({ msg: "Catch Error In Getting Configs", success: false }).status( 500 );
        } )
    }else{
        return res.json({ msg: eMessage , success: false}).status( 400 );
    }
} )


Router.post ("/", ( req, res ) => {
    Configs.findOne()
    .then( config => {  
        return res.json({ msg: "Configs", config, success: true  }).status( 200 )  ;
    } )
    .catch( err => {
        return res.json({ msg: "Catch Error In Config", success: false }).status( 500 );
    } )
})
module.exports = Router;
