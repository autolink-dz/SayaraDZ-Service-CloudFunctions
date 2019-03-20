const functions = require("firebase-functions");
const admin  = require("firebase-admin");


const onModelDeleted = functions.firestore.document('modeles/{id_modele}')
    .onDelete((snap, context) => {
        
        console.log("onModelDeleted trigger");
        
        let id_modele = context.params.id_modele
        return admin.firestore().collection("versions")
                    .where("id_modele","==",id_modele)
                    .get()
                    .then(snapshot => {
                        let batch =  admin.firestore().batch()
                        
                        snapshot.docs.forEach(doc => {
                                batch.delete(doc.ref);
                        })
                        
                    return batch.commit(); 
                    })
     
});


module.exports ={
    onModelDeleted
        }