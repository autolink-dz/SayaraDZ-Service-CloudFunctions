const admin = require("firebase-admin")

const getCarDriver = (req,res)=>{
    const uid = req.params.UID
    
    return admin.firestore().collection("automobilistes")
                     .doc(uid)
                     .get()
                     .then(doc => {
                         res.status(200).json(doc.data())
                         return 0;
                     })
                     .catch((err)=>{
                         res.status(500).send(err)
                         return 0;
                     })
}


module.exports = {  getCarDriver }