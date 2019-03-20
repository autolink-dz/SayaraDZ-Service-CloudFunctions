const functions = require("firebase-functions");
const admin  = require("firebase-admin");


// TODO: delete stocks, prices ,commands
const onBrandDeleted = functions.firestore.document('marques/{id_marque}')
    .onDelete((snap, context) => {

     console.log("onBrandDeleted Trigger");
     
     let id_marque = context.params.id_marques
     //deleting the car provider users
     return admin.firestore().collection("fabricants")
                 .where("id_marque","==",id_marque)
                 .get()
                 .then(snapshot => {
                        let batch =  admin.firestore().batch()
                        
                        snapshot.docs.forEach(doc => {
                                batch.delete(doc.ref);
                                admin.auth().deleteUser(doc.id)  
                        })
                    return batch.commit(); 
                 })
                 .then(()=>{
                     //deleting the models
                     return admin.firestore().collection("modeles")
                                      .where("id_marque","==",id_marque)
                                      .get()
                 })
                 .then(snapshot => {
                    let batch =  admin.firestore().batch()
                    
                    snapshot.docs.forEach(doc => {
                                batch.delete(doc.ref);
                    })

                    return batch.commit(); 
                })
                .then(()=>{
                    // delete the stock
                    return admin.firestore().collection("vehicule")
                                     .doc(id_marque)
                                     .delete()

                })
                .then((res)=>{
                    // delete the price
                    return admin.firestore().collection("tarifs")
                                     .doc(id_marque)
                                     .delete()

                })
                .then((res)=>{
                    // delete the commands
                    return admin.firestore().collection("commandes")
                                     .where("id_marque","==",id_marque)
                                     .get()
                })
                .then(snapshot => {
                    let batch =  admin.firestore().batch()
                                       
                     snapshot.docs.forEach(doc => {
                            batch.delete(doc.ref);
                     })
                   
                    return batch.commit(); 
                })
                .catch((err)=>{
                    console.log(err);
                })
});



module.exports ={
    onBrandDeleted
        }