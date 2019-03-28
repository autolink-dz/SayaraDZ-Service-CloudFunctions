const functions = require("firebase-functions");
const admin  = require("firebase-admin");

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
              

              const ORDER_REJECTED = 0
              const ORDER_ACCEPTED = 2
              const order = change.after.data();
              const oldData = change.before.data();
              const notification = {
                      title:"",
                      body:""
              }
             
              if(order.etas == oldData.etas) return //the order state didn't change
              switch (order.etas) {
                    case ORDER_REJECTED:
                            notification.title = "Commande rejetée"
                            break;
                    case ORDER_ACCEPTED:
                            notification.title = "Commande validée"
                            break;
                    default:
                           return
              }

              notification.body = order.message
              return  admin.firestore().collection("versions")
                           .doc(order.id_version)
                           .get()
                           .then(doc => {
                                        let version = doc.data()
                                        return sendNotification({ notification,
                                                data: {
                                                    version: version.nom,
                                                    price: String(order.prix),
                                                    date: order.date.toDate().toString(),
                                                    photo: version.url,
                                                }},order.id_automobiliste)
                                        
                           })
                           .then(()=>{
                                   if(order.etas == ORDER_REJECTED)
                                        return updateCarState(order.id_marque,order.id_vehicule,true)
                                   else 
                                        return
                           })  
      });

module.exports ={
    onOrderCreated,
    onOrderUpdated
}