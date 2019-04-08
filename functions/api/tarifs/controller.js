const admin = require("firebase-admin");

const getPrice = (req,res)=>{
    const id_marque  = req.params.ID_MARQUE
    const code_modele  = req.params.CODE_MODELE
    const code       = req.params.CODE
    const type       = req.type  
    const date       = new Date()
    
    return admin.firestore().collection("tarifs")
                            .doc(id_marque)
                            .getCollections()
                            .then(collections=>{
                                ids = collections.map(collection=>{
                                    return  parseInt(collection.id)
                                })
            
                                var recentPricesFileId = String(Math.max.apply( null, ids ));
                                
                                return admin.firestore().collection("tarifs")
                                            .doc(id_marque)
                                            .collection(recentPricesFileId)
                                            .where("type","==",type)
                                            .where("code","==",code)
                                            .where("modele","==",code_modele)
                                            .get()
                            
                            })
                            .then(snapshot=>{
                            
                                
                                let docs  = snapshot.docs.filter(doc=>{
                                   return doc.data().date_fin.toDate() >= date && doc.data().date_debut.toDate() <= date
                                })

                                let data = docs[0].data()
                                if(data) data.marque  = id_marque
                                res.status(200).json(data)
                                return 0;
                            })
                            .catch((err)=>{
                               res.status(500).send(err)
                               return 0;
                            })


}

module.exports = { getPrice } 