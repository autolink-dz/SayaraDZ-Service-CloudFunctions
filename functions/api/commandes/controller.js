const admin = require("firebase-admin")

const setOrder = (req,res)=>{

    const data   = req.body
    const order  = {
        id_marque: data.id_marque,
        id_automobiliste : data.id_automobiliste,
        id_version:data.id_version,
        id_vehicule : data.id_vehicule,
        prix : parseFloat(data.prix),
        etas : 1,
        message: "",
        versement: parseFloat(data.versement),
        date: new Date()
    }

    let ref = admin.firestore().collection("commandes")
                     .doc()
    order.id  = ref.id
    
        return ref.set(order)
                  .then((result)=>{
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
    let extras = {
        automobilistes:{},
        versions:{}
    }
    let users = []
    let versions = []
    let usersDocsPromise = []
    let versionsDocsPromise = []
    const id_marque  = req.query.id_marque

    admin.firestore().collection("commandes")
                     .where("id_marque","==",id_marque)
                     .orderBy("date")
                     .get()
                     .then(snapshot => {
                            snapshot.docs.forEach(doc => {
                                         let order =  doc.data()
                                         users.push(order.id_automobiliste)
                                         versions.push(order.id_version)
                                         data.push(order)
                                     })

                            users = Array.from(new Set(users));
                            versions = Array.from(new Set(versions));
             
                            users.forEach(id =>{
                                usersDocsPromise.push(admin.firestore().collection("automobilistes")
                                                .doc(id)
                                                .get())
                            })

                            versions.forEach(id=>{
                                versionsDocsPromise.push(admin.firestore().collection("versions")
                                                    .doc(id)
                                                    .get()) 
                            })
                         
                          
                          
                            return Promise.all(usersDocsPromise)
                      })
                      .then(docs => {
                        

                        docs.forEach(doc => {
                            extras.automobilistes[doc.id] = doc.data() 
                        })

                        return Promise.all(versionsDocsPromise)
                       })
                      .then(docs => {
                        

                        
                        docs.forEach(doc => {
                            extras.versions[doc.id] = doc.data() 
                        })

                        res.status(200).send({ data , extras })
                             return 0;

                       })

                         .catch((err)=>{
                             console.log(err);
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