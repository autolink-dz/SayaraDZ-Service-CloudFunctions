const functions = require("firebase-functions");
const admin  = require("firebase-admin");


const onCarProviderUpdated = functions.firestore.document('fabricants/{id}')
        .onUpdate((change, context) => {

            console.log("onCarProviderUpdated trigger");
            
            let id  = context.params.id
            let newCredentials = change.after.data();


            return admin.auth().updateUser(id, {
                email: newCredentials.mail,
                emailVerified: false,
                phoneNumber: newCredentials.num_tlp,
                password: newCredentials.mdp,
                displayName: newCredentials.prenom + " " + newCredentials.nom,
                disabled: newCredentials.disabled
            })
        });

module.exports ={
        onCarProviderUpdated
            }