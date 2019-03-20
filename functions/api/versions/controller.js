const admin = require("firebase-admin");


const setVersion= (req,res)=>{

    const body  = req.body        
    const data = {
        code: body.code,
        id_marque: body.id_marque,
        id_modele: body.id_modele,
        nom: body.nom,
        url: body.url,
        fiche_tech: body.fiche_tech,
        options: body.options || null,
        couleurs: body.couleurs  || null
      }

    return admin.firestore().collection("versions")
                    .where("id_marque","==",data.id_marque)
                    .where("id_modele","==",data.id_modele)
                    .where("code","==",data.code)
                    .get()
                    .then(snapshot=>{
                       
                        if(snapshot.size > 0){
                            return 0;
                        
                        }else{
                            const ref  = admin.firestore().collection("versions")
                                              .doc()

                            data.id = ref.id
                            return ref.set(data)
                        
                        }
                    }).then((result) => {
                        if(result ==0)
                          res.status(500).json({error: "version aleardy exist"})
                        else 
                          res.status(200).json(data)
                    
                       return 0;
                    })    
                    .catch((err)=>{
                        res.status(500).send(err)
                        return 0;
                    })
}

const getVersions = (req,res)=>{
    const next  = req.query.next 
    const page = req.query.page || 20
    const id_modele  = req.query.id_modele

    let data = [];
    let snapshotPromise;
    let ref = admin.firestore()
                    .collection("versions")
            
   
    if(id_modele) ref = ref.where("id_modele","==",id_modele)
 
    if(next != 0 ){
         snapshotPromise =  admin.firestore().collection("versions").doc(next)
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

const getVersion  = (req,res)=>{
        const versionID = req.params.ID_VERSION
        
       return admin.firestore().collection("versions")
                        .doc(versionID)
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

const updateVersion= (req,res)=>{
        const data  = req.body
        const versionID = req.params.ID_VERSION
    
        return admin.firestore().collection("versions")
                        .doc(versionID)
                        .update(data)
                        .then((result) => {
                            data.id = versionID
                            res.status(200).json(data)
                            return 0;
                        })
                        .catch((err)=>{
                            res.status(500).send(err)
                            return 0;
                        })
                      
    }

const deleteVersion = (req,res)=>{
        const versionID = req.params.ID_VERSION
    
        return admin.firestore().collection("versions")
                         .doc(versionID)
                         .delete()
                         .then(()=>{
                            res.status(200).json({id:versionID})
                            return 0;
                         })
                         .catch((err)=>{
                            res.status(500).send(err)
                            return 0;
                        })
    };

module.exports = {  setVersion, 
                    getVersions ,
                    getVersion ,
                    updateVersion ,
                    deleteVersion}
 