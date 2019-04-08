const admin = require("express").Router()

/**
 * verify the admin auth claim
 */
admin.get("/",(req,res)=>{
  
        res.json({admin: req.decodedToken.admin || false}).status(200)
        return 0;
                    

});

module.exports = admin;