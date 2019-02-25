const admin = require("firebase-admin");



const getCarProviders = (req,res)=>{
   let data = [];
   const next  = req.query.next 
   const page = req.query.page || 20
   const id_marque  = req.query.id_marque || null
  
   ref = admin.firestore().collection("fabricants").orderBy("uid")
   if (next != 0) ref = ref.startAfter(next)
    
    return ref.limit(page)
            .get()
            .then(snapshot => {
                snapshot.docs.filter(doc => id_marque ? doc.data().id_marque == id_marque : true)
                        .forEach(doc => {
                            data.push({
                                id: doc.id,
                                data:doc.data()
                            })
                        })

                let next  = snapshot.docs[snapshot.size-1].id
                res.json({next,data}).status(200)
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