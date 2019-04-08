const functions = require("firebase-functions");
const admin  = require("firebase-admin");
const utils = require("../../utils")


const updateCarState = (id_marque,id_vehicule,state)=>{
        
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
                        .doc(id_vehicule)
                        .update({ disponible: state })
        
        })
} 


const sendNotification = (payload,uid)=>{
        
        return admin.firestore().collection("automobilistes")
                     .doc(uid)
                     .get()
                     .then(doc => {
                        let token = doc.data().instance_token
                        return admin.messaging().sendToDevice(token, payload);
                     })
                     .catch((err)=>{
                         console.log(err);
                         return 0;
                     })
}


const onOrderCreated = functions.firestore.document('commandes/{id_commande}')
      .onCreate((snap, context) => {
            console.log("onOrderCreated trigger");
            const order = snap.data();
            return updateCarState(order.id_marque,order.id_vehicule,false)
       });


const onOrderUpdated = functions.firestore.document('commandes/{id_commande}')
      .onUpdate((change, context) => {
              
              const order = change.after.data();
              const oldData = change.before.data();
              let data
              let validation
             
              if(order.etas == oldData.etas) return //the order state didn't change
              
              switch (order.etas) {
                    case utils.orderState.rejected:
                            validation = String(false)
                            break;
                    case utils.orderState.accepted:
                            validation = String(true)
                            break;
                    default:
                           return
              }

             
              return  admin.firestore().collection("versions")
                           .doc(order.id_version)
                           .get()
                           .then(doc => {
                                
                                let version = doc.data()
                                data = {
                                        android_channel_id: "0",
                                        validation:String(validation),
                                        version: version.nom,
                                        message:order.message,
                                        price: String(order.prix),
                                        date: order.date.toDate().toString(),
                                        photo: version.url,
                                       }

                                return  admin.firestore().collection("marques")
                                                         .doc(version.id_marque)
                                                         .get()
                           })
                           .then(doc => {
                                       
                                data.photo =  doc.data().url
                                return sendNotification( {data} , order.id_automobiliste)
                                
                           })
                           .then(()=>{
                                   if(order.etas == utils.orderState.rejected)
                                        return updateCarState(order.id_marque,order.id_vehicule,true)
                                   else 
                                        return 0
                           })  
      });

module.exports ={
    onOrderCreated,
    onOrderUpdated
}