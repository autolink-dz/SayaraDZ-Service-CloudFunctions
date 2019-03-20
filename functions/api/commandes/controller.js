const admin = require("firebase-admin")

const setOrder = (req,res)=>{

    const data   = req.body
    const order  = {
        id_marque: data.id_marque,
        id_automobiliste : data.id_automobiliste,
        id_voiture : data.id_voiture,
        prix : data.prix,
        etas : 1,
        message: null,
        versement: data.versement,
        date: new Date()
    }

    let ref = admin.firestore().collection("commandes")
                     .doc()
    order.id  = ref.id
    
        return ref.set(order)
                    .then((res)=>{
                        res.status(200).json({order})
                        return 0;
                    })    
                  .catch((err) => {
                        res.status(500).send(err)
                        return 0;
                    });
}


const getOrders = (req,res)=>{
    let data = [];
    const id_marque  = req.query.id_marque

    admin.firestore().collection("commandes")
                     .where("id_marque","==",id_marque)
                     .orderBy("date")
                     .get()
                     .then(snapshot => {
                             snapshot.docs.forEach(doc => {
                                         data.push(doc.data())
                                     })
             
                             res.status(200).json({data})
                             return 0;
                         })
                         .catch((err)=>{
                             res.status(500).send(err)
                             return 0;
                         })

            
}


const getOrder = (req,res)=>{
    const id = req.params.ID_COMMANDE
    
    return admin.firestore().collection("commandes")
                     .doc(id)
                     .get()
                     .then(doc => {
                         res.status(200).json(doc.data())
                         return 0;
                     })
                     .catch((err)=>{
                         res.status(500).send(err)
                         return 0;
                     })
}


const updateOrder=(req,res)=>{
    
    const id = req.params.ID_COMMANDE
    const data  = req.body

    // TODO: a trigger to update the car state 
    // TODO: a trigger to notify the user

    return admin.firestore().collection("commandes")
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


// TODO: a trigger to update the car state
const deleteOrder = (req,res)=>{
    const id = req.params.ID_COMMANDE

    return admin.firestore().collection("commandes")
                .doc(id)
                .delete()
}


module.exports = {  setOrder,
                    getOrders,
                    getOrder,
                    updateOrder,
                    deleteOrder
                }