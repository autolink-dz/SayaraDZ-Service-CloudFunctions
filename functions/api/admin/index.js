const admin = require("express").Router()

admin.get("/",(req,res)=>{
  
        res.json({admin: req.decodedToken.admin || false}).status(200)
        return 0;
                    

});

module.exports = admin;