const admin = require("firebase-admin");



const getCars= (req,res)=>{
    let data = [];
    
    const id_marque      = req.params.ID_MARQUE
    const modele         = req.query.modele || null
    const version        = req.query.version || null
    const couleur        = req.query.couleur || null
    const options_string = req.query.options ||  null
    const disponible     = req.query.disponible ||  null
    const options        = options_string ?  options_string.split(',') : null

    return admin.firestore().collection("vehicules")
                .doc(id_marque)
                .getCollections()
                .then(collections=>{
                    
                    let ids = collections.map(collection=>{                        
                        return  parseInt(collection.id)
                    })
                    
                    let recentStockId = Math.max.apply( null,ids );
                    
                    let ref =  admin.firestore().collection("vehicules")
                                .doc(id_marque)
                                .collection(""+recentStockId)

                    if (modele)     ref = ref.where("modele","==",modele)
                    if (version)    ref = ref.where("version","==",version)
                    if (couleur)    ref = ref.where("couleur","==",couleur)
                    if (options)    ref = ref.where("options","==",options)
                    if (disponible) ref = ref.where("disponible","==",disponible)
                    
                    return ref.get()
                
                })
                .then(snapshot=>{
                     snapshot.docs.forEach(doc => {
                        let car  = doc.data()
                        car.stock  = recentStockId
                        data.push(car)
                     })

                    res.status(200).json({data})
                    return 0;
                })
                .catch((err)=>{
                    res.status(500).send(err)
                    return 0;
                })
           
}





module.exports = { getCars }

