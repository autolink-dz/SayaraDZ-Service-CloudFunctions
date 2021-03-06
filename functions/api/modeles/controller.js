const admin = require("firebase-admin");


const setModel= (req,res)=>{

    const body  = req.body
   
    const data  = {
                    nom: body.nom,
                    url: body.url,
                    code: body.code,
                    id_marque: body.id_marque,
                    options: body.options || null,
                    couleurs: body.couleurs  || null}

    return admin.firestore().collection("modeles")
                    .where("id_marque","==",data.id_marque)
                    .where("code","==",data.code)
                    .get()
                    .then(snapshot =>{
                      
                        if(snapshot.size > 0){
                            return 0;
                        }else{
                            
                            let ref  = admin.firestore().collection("modeles").doc()
                            data.id = ref.id
                            return ref.set(data) 

                           }
                    })
                    .then((result) => {
                        if(result ==0)
                          res.status(409).json({error: "model aleardy exist"})
                        else 
                          res.status(200).json(data)
                    
                       return 0;
                    })
                    .catch((err)=>{
                        res.status(500).send(err)
                        return 0;
                    })
                   
}

const getModels = (req,res)=>{
    const next  = req.query.next 
    const page = req.query.page || 20
    const id_marque  = req.query.id_marque
    let data = [];
    let snapshotPromise;
    let ref = admin.firestore().collection("modeles");
   
    if(id_marque) ref = ref.where("id_marque","==",id_marque)
 
    if(next != 0 ){
         snapshotPromise = admin.firestore().collection("modeles")
                                            .doc(next)
                                            .get()
                                            .then(doc => {
                                                 return ref.orderBy("nom")
                                                             .startAfter(doc)
                                                             .limit(parseInt(page))
                                                             .get()})
     }else{
         snapshotPromise =  ref.orderBy("nom")
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
 
const getModel  = (req,res)=>{
        const id = req.params.ID_MODELE
        
       return admin.firestore().collection("modeles")
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

const updateModel= (req,res)=>{
    const id = req.params.ID_MODELE
    const data  = req.body

    return admin.firestore().collection("modeles")
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
const deleteModel = (req,res)=>{
    const id = req.params.ID_MODELE

    return admin.firestore().collection("modeles")
                     .doc(id)
                     .delete()
                     .then(()=>{
                        
                        res.status(200).json({id})
                        return 0;
                     })
                     .catch((err)=>{
                        res.status(500).send(err)
                        return 0;
                    })
};


module.exports = {getModels ,
                  getModel ,
                  updateModel ,
                  deleteModel ,
                  setModel }
