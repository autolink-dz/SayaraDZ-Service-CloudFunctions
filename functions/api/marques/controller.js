const admin = require("firebase-admin");



const getBrands = (req,res)=>{
   let data = [];
   const next  = req.query.next 
   const page = req.query.page || 20
  
   ref = admin.firestore().collection("marques").orderBy("id")
   if (next != 0) ref = ref.startAfter(next)
    
    return ref.limit(page)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
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
const getBrand  = (req,res)=>{
    const id = req.params.ID_MARQUE
    
   return admin.firestore().collection("marques")
                    .doc(id)
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

const updateBrand= (req,res)=>{
    const id = req.params.ID_MARQUE
    const body  = req.body

    return admin.firestore().collection("marques")
                    .doc(id)
                    .update(body)
                    .then((result) => {
                        res.json({id, data: body}).status(200)
                        return 0;
                    })
                  
}

const setBrand= (req,res)=>{

    const body  = req.body
    const ref  = admin.firestore().collection("marques").doc()

    body.id = ref.id
    return admin.firestore().collection("marques")
                    .doc(ref.id)
                    .set(body)
                    .then((ref) => {
                        res.json({id: ref.id, data: body}).status(200)
                        return 0;
                    })
                  
}

const deleteBrand = (req,res)=>{
    const id = req.params.ID_MARQUE

    return admin.firestore().collection("marques")
                .doc(id)
                .delete()
                .then((result) => {
                       return admin.firestore().collection("fabricants")
                                         .where("id_marque","==",id)
                                         .get()
                                         .then(snapshot => {
                                            const batch =  admin.firestore().batch()
                                            snapshot.docs.forEach(doc => {
                                                batch.delete(doc.ref);
                                                admin.auth().deleteUser(doc.id)  
                                                })
                                            return batch.commit(); })
                                          .then((result) => {
                                                res.json({id}).status(200)
                                                return 0;
                                           })
                 })
                
            
   
};


module.exports = {getBrands,
                  getBrand,
                  updateBrand,
                  deleteBrand,
                  setBrand}