const admin  = require("firebase-admin")



const setOffer = (req,res)=>{

    const body = req.body
    const data  = {
        id_offre: body.id_proprietaire,
        id_proprietaire : body.id_proprietaire,
        id_client: body.id_client,
        prix: parseFloat(body.prix),
        etat: 1,
        date:new Date()
    }

    let ref = admin.firestore().collection("offres")
                               .doc()
    
    data.id = ref.id
   
    return ref.set(data)
              .then((result)=>{
                res.status(200).send(data)
                return 0
               })
              .catch((err)=>{
                res.status(500).send(err)
                return
              })
}

const updateOffer = (req,res)=>{
    
        const id = req.params.ID_OFFRE
        const data  = req.body
    
        return admin.firestore().collection("offres")
                        .doc(id)
                        .update(data)
                        .then((result) => {
                            data.id = id
                            res.status(200).json(data)
                            return 0;
                        })
                        .catch((err)=>{
                            res.status(500).send(err)
                            return 0;
                        })
}