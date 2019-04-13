const admin = require("firebase-admin")
const functions = require("firebase-functions");
const utils = require("../../utils")

const onOfferCreated = functions.firestore.document('offres/{id_offre}')
    .onCreate((snap, context) => {

        const offer = snap.data();
        const data  = {}
        
        data.offerId = offer.id
        data.price = offer.prix.toString()
        data.clientId = offer.id_client
        
        data.id = offer.id
        return admin.firestore().collection("annonces")
                    .doc(offer.id_annonce)
                    .get()
                    .then(doc => {

                        let data = doc.data()
                        let versionId = data.id_version
                        
                        data.announcementId = data.id

                        return  admin.firestore().collection("versions")
                                    .doc(versionId)
                                    .get()

                    }) 
                    .then(doc =>{
                        
                        data.version = doc.data().nom 
                     
                        return  admin.firestore().collection("automobilistes")
                                    .doc(offer.id_client)
                                    .get()
                    })
                    .then(doc =>{
                        let client = doc.data()
                        
                        data.client  = client.nom
                        data.photo = client.photoURL
                        data.ownerId = offer.id_proprietaire
                        data.android_channel_id = "2"

                        return utils.sendNotification({ data },offer.id_proprietaire)
                        
                    })
    })

const onOfferUpdated = functions.firestore.document('offres/{id_offre}')
    .onUpdate((change, context) => {

        const offer = change.after.data();
        const oldData = change.before.data();
        const data = {}

        if(offer.etat == oldData.etat) return //the offer state didn't change

       
        
        switch (parseInt(offer.etat)) {
            case utils.orderState.rejected:
                    data.validation = String(false)
                    break;
            case utils.orderState.accepted:
                    data.validation = String(true)
                    break;
            default:
                   return
        }

        data.id = offer.id
      

        return admin.firestore().collection("annonces")
                    .doc(offer.id_annonce)
                    .get()
                    .then(doc => {

                        let data = doc.data()
                        let versionId = data.id_version

                        return  admin.firestore().collection("versions")
                                    .doc(versionId)
                                    .get()

                    }) 
                    .then(doc =>{
                        
                        data.version = doc.data().nom 
                     
                        return  admin.firestore().collection("automobilistes")
                                    .doc(offer.id_proprietaire)
                                    .get()
                    })
                    .then(doc =>{
                        
                        let owner = doc.data()
                        
                        data.owner  = owner.nom
                        data.photo = owner.photoURL
                        data.contact = owner.email
                        data.android_channel_id = "1"

                        return utils.sendNotification({ data },offer.id_proprietaire)
                        
                    })
                    .then((res)=>{
                        if( data.validation == "true")
                                return utils.updateAnnounceState(offer.id_annonce,false)
                        else 
                                return 0
                    })



    })

    module.exports = {  
                    onOfferCreated,
                    onOfferUpdated 
                }