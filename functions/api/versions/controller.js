const admin = require("firebase-admin");


const getVersions = (req,res)=>{
    const next  = req.query.next 
    const page = req.query.page || 20
    const modelID  = req.ID_MODELE

    let data = [];
    let snapshotPromise;
    let ref = admin.firestore().collection("modeles").doc(modelID).collection("versions");
   

 
    if(next != 0 ){
         snapshotPromise = ref.doc(next)
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
                                     res.json({next,data}).status(200)
                                     return 0;
                                 })
            
    }

const getVersion  = (req,res)=>{
        const versionID = req.params.ID_VERSION
        const modelID   = req.ID_MODELE
        
       return admin.firestore().collection("modeles")
                        .doc(modelID)
                        .collection("versions")
                        .doc(versionID)
                        .get()
                        .then(doc => {
                            res.json(doc.data()).status(200)
                            return 0;
                        })
    }

const updateVersion= (req,res)=>{
        const data  = req.body
        const versionID = req.params.ID_VERSION
        const modelID   = req.ID_MODELE
    
        return admin.firestore().collection("modeles")
                        .doc(modelID)
                        .collection("versions")
                        .doc(versionID)
                        .update(data)
                        .then((result) => {
                            data.id = versionID
                            res.json(data).status(200)
                            return 0;
                        })
                      
    }

const setVersion= (req,res)=>{

        const body  = req.body
        const modelID   = req.ID_MODELE

        console.log(req.params);
        
        const ref  = admin.firestore().collection("modeles")
                            .doc(modelID)
                            .collection("versions")
                            .doc()
        
        const data = {
            id: ref.id,
            nom: body.nom,
            url: body.url,
            fiche_tech: body.fiche_tech,
            options: body.options || null,
            colors: body.colors  || null
          }

        return ref.set(data)
                        .then((result) => {
                            res.json(data).status(200)
                            return 0;
                        })          
    }

const deleteVersion = (req,res)=>{
        const versionID = req.params.ID_VERSION
        const modelID   = req.ID_MODELE
    
        return admin.firestore().collection("modeles")
                         .doc(modelID)
                         .collection("versions")
                         .doc(versionID)
                         .delete()
                         .then(()=>{
                            res.json({versionID}).status(200)
                            return 0;
                         })
    };

module.exports = {  getVersions ,
                    getVersion ,
                    updateVersion ,
                    deleteVersion ,
                    setVersion }
 