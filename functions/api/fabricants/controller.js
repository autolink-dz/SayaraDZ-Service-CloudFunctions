const admin = require("firebase-admin");



const getCarProviders = (req,res)=>{
   let data = [];
   const next  = req.query.next 
   const page = req.query.page || 20
   const id_marque  = req.query.id_marque || null
  
   ref = admin.firestore().collection("fabricants")
            
   if (id_marque) ref = ref.where("id_marque","==",id_marque); else  ref = ref.orderBy("id_marque")
   ref  = ref.orderBy("id")
   if (next != 0) ref = ref.startAfter(next)
    return ref.limit(page)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                            data.push(doc.data())
                        })

                let next  = snapshot.size > 0 ? snapshot.docs[snapshot.size-1].id : null
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
                        res.json(doc.data()).status(200)
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
                        body.id = uid 
                        res.json(body).status(200)
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
                        res.json({id:uid}).status(200)
                        return 0;
                })
};

module.exports = {getCarProviders,
                  getCarProvider,
                  updateCarProvider,
                  deleteCarProvider}