const functions = require("firebase-functions");
const admin  = require("firebase-admin");

const updateCarState = (id_marque,id_voiture,state)=>{
        
        return admin.firestore().collection("vehicules")
        .doc(id_marque)
        .getCollections()
        .then(collections=>{
                            
            let ids = collections.map(collection=>{                        
                    return  parseInt(collection.id)
            })

            let recentStockId = Math.max.apply( null,ids );

            return admin.firestore().collection("vehicules")
                        .doc(id_marque)
                        .collection(String(recentStockId))
                        .doc(id_voiture)
                        .update({ disponible: state })
        
        })
} 


const onOrderCreated = functions.firestore.document('commandes/{id_commande}')
      .onCreate((snap, context) => {
            console.log("onOrderCreated trigger");
            const order = snap.data();
            return updateCarState(order.id_marque,order.id_voiture,false)
       });

const onOrderUpdated = functions.firestore.document('commandes/{id_commande}')
      .onUpdate((change, context) => {
            console.log("onOrderUpdateTrigger");
      });

module.exports ={
    onOrderCreated,
    onOrderUpdated
}