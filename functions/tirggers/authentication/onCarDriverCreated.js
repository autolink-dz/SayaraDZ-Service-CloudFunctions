const admin = require("firebase-admin")

/**
 * create a car driver user object using the info retrieved from the auth provider: Facebook or Google
 * @param {user} firebase user object 
 */
const onCarDriverCreated = (user)=>{
    const email = user.email;
    const uid = user.uid;
    const photoUrl  = user.photoUrl; 
    const name = user.displayName;
    
    admin.auth().setCustomUserClaims(uid, {automobiliste: true})
    return admin.firestore().collection("automobilistes").doc(uid).set({
        id:uid,
        email,
        name,
        photoUrl,
    })
}


module.exports = onCarDriverCreated
