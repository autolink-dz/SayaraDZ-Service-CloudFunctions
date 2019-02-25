const admin = require("firebase-admin")

/**
 * create a car provider document with emil
 * @param {user} firebase user object
 */
const onCarProviderCreated = (user)=>{
    const email = user.email;
    const uid = user.uid;
    const nom = null;
    const prenom = null
    const num_tel = null
    const id_marque  = null

    

    console.log("Creating user document for user with email: "+email);

    return admin.firestore().collection("fabricants").doc(uid).set({
        email,
        nom,
        prenom,
        num_tel,
        id_marque,
    })
}


module.exports = onCarProviderCreated