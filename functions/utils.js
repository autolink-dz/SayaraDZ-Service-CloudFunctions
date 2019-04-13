const admin = require("firebase-admin")

const orderState = {
    rejected: 0,
    pending: 1,
    accepted: 2
}

const stockItem  = {
    "0": "couleur",
    "1": "version",
    "2": "option"
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

const updateAnnounceState = (id,state)=>{
        
    return admin.firestore().collection("annonces")
          .doc(id)
          .update({
              disponible:state
          })
          
          }

module.exports = {
    orderState,
    stockItem,
    updateCarState,
    updateAnnounceState,
    sendNotification,
}

