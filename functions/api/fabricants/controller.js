const admin = require("firebase-admin");



const getCarProviders = (req,res)=>{
    var data = [];


    return admin.firestore().collection("fabricants")
            .get()
            .then(snapshot => {
            
                snapshot.forEach(doc => {
                    data.push({
                        id: doc.id,
                        data:doc.data()
                    })
                })
                res.json(data).status(200)
                return 0;
            })
            
           
    }
const getCarProvider  = (req,res)=>{
    const uid = req.params.ID_FABRIQUANT
    
   return admin.firestore().collection("fabricants")
                    .doc(uid)
                    .get()
                    .then(doc => {
            
                            var data = {
                                id: doc.id,
                                data:doc.data()
                            }

                        res.json(data).status(200)
                        return 0;
                    })
                    
}

const updateCarProvider = (req,res)=>{
    const uid = req.params.ID_FABRIQUANT
    const body  = req.body

    return admin.firestore().collection("fabricants")
                    .doc(uid)
                    .update(body)
                    .then((result) => {
                        res.json({id: uid, data: body}).status(200)
                        return 0;
                    })
                  
}

const deleteCarProvider = (req,res)=>{
    const uid = req.params.ID_FABRIQUANT
    return admin.auth().deleteUser(uid)
                .then((result)=>{
                        return admin.firestore().collection("fabricants")
                                    .doc(uid)
                                    .delete()})
                .then((result) => {
                        res.json({uid}).status(200)
                        return 0;
                })
            
   
};


module.exports = {getCarProviders,
                  getCarProvider,
                  updateCarProvider,
                  deleteCarProvider}