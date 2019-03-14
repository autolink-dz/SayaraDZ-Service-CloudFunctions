const admin = require("firebase-admin");


const getBrands = (req,res)=>{
   let data = [];
   const next  = req.query.next 
   const page = req.query.page || 20
   let snapshotPromise;

    if(next != 0 ){
        snapshotPromise = admin.firestore().collection("marques")
                                           .doc(next)
                                           .get()
                                           .then(doc => {
                                                return admin.firestore().collection("marques")
                                                            .orderBy("nom")
                                                            .startAfter(doc)
                                                            .limit(parseInt(page))
                                                            .get()})
    }else{
        snapshotPromise =  admin.firestore().collection("marques")
                                            .orderBy("nom")
                                            .limit(parseInt(page))
                                            .get()
    }
    return  snapshotPromise.then(snapshot => {
                                    snapshot.docs.forEach(doc => {
                                                data.push(doc.data())
                                            })
                                    
                                    let next  = snapshot.size > 0 ? snapshot.docs[snapshot.size-1].id : null
                                    res.status(200).json({next,data})
                                    return 0;
                                })
                                .catch((err)=>{
                                    res.status(500).send(err)
                                    return 0;
                                })
           
    }

const getBrand  = (req,res)=>{
    const id = req.params.ID_MARQUE
    
   return admin.firestore().collection("marques")
                    .doc(id)
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

const updateBrand= (req,res)=>{
    const id = req.params.ID_MARQUE
    const data  = req.body

    return admin.firestore().collection("marques")
                    .doc(id)
                    .update(data)
                    .then((result) => {
                        data.id = id
                        res.status(200).json(data)
                        return 0;
                    })
                    .catch((err)=>{
                        res.status(500).send(err)
                        return 0;
                    })
                  
}

const setBrand= (req,res)=>{

    const body  = req.body
    const data  = {
        nom: body.nom,
        url: body.url }

    return admin.firestore().collection("marques")
                   .where("nom","==",body.nom)
                   .get()
                   .then(snapshot=>{
                       
                    if(snapshot.size > 0){
                        return 0;
                    }else{
                        let ref  = admin.firestore().collection("marques").doc()
                        data.id = ref.id
                        return ref.set(data)
                    }
                   }).then((result) => {
                        
                        if(result == 0)
                          res.status(500).json({error: "brand aleardy exist"})
                        else 
                          res.status(200).json(data)
                    
                       return 0;
                    })
                    .catch((err)=>{
                        res.status(500).send(err)
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