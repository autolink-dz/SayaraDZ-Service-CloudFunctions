const admin = require("firebase-admin");

const getPrice = (req,res)=>{
    const id_marque  = req.params.ID_MARQUE
    const code_modele  = req.params.CODE_MODELE
    const code       = req.params.CODE
    const type       = req.type  
    const date       = new Date()

    return admin.firestore().collection("tarifs")
                            .doc(id_marque)
                            .then(collections=>{
                                ids = collections.map(collection=>{
                                    return  parseInt(collection.id)
                                })
            
                                var recentPricesFileId = String(Math.max.apply( null, ids ));
                                
                                return admin.firestore().collection("vehicules")
                                            .doc(id_marque)
                                            .collection(recentPricesFileId)
                                            .where("type","==",type)
                                            .where("code","==",code)
                                            .where("modele","==",code_modele)
                                            .where("date_debut","<=",date)
                                            .where("date_fin",">=",date)
                                            .orderBy("date_debut")
                                            .limit(1)
                                            .get()
                            
                            })
                            .then(snapshot=>{

                                let data = snapshot.docs[0] || null
                                res.status(200).json(data)
                                return 0;
                            })
                            .catch((err)=>{
                               res.status(500).send(err)
                               return 0;
                            })


}

module.exports = { getPrice } 