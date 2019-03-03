const admin = require("firebase-admin")
const util = require('util');
/**
 * create a car driver user object using the info retrieved from the auth provider: Facebook or Google
 * @param {user} firebase user object 
 */
const onCarDriverCreated = (user)=>{
    const email = user.email;
    const uid = user.uid;
    const photoURL  = user.photoURL; 
    const nom = user.displayName;
    
    return admin.firestore().collection("automobilistes").doc(uid).set({
        id:uid,
        email,
        nom,
        photoURL,
    })
}


module.exports = onCarDriverCreated
