const marques = require("express").Router()

marques.get("/",(req,res)=>{
    res.status(403).send('hellow world');
});

marques.get("/:ID_MARQUE",(req,res)=>{
    
});

marques.post("/:ID_MARQUE",(req,res)=>{
    
});

marques.put("/:ID_MARQUE",(req,res)=>{
    
})

marques.delete("/:ID_MARQUE",(req,res)=>{
    
})

module.exports = marques;