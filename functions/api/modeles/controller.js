const admin = require("firebase-admin");


const getModels = (req,res)=>{
    const next  = req.query.next 
    const page = req.query.page || 20
    const brand  = req.query.brand
    let data = [];
    let snapshotPromise;
    let ref = admin.firestore().collection("modeles");
   
    if(brand) ref = ref.where("id_marque","==",brand)
 
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
                                     res.json({next,data}).status(200)
                                     return 0;
                                 })
            
     }
 
const getModel  = (req,res)=>{
        const id = req.params.ID_MODELE
        
       return admin.firestore().collection("modeles")
                        .doc(id)
                        .get()
                        .then(doc => {
                            res.json(doc.data()).status(200)
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
                        res.json(data).status(200)
                        return 0;
                    })
                  
}

const setModel= (req,res)=>{

    const body  = req.body
    const ref  = admin.firestore().collection("modeles").doc()
    
    body.id = ref.id
    const data  = {
                    id: body.id,
                    nom: body.nom,
                    url: body.url,
                    id_marque: body.id_marque,
                    options: body.options || null,
                    colors: body.colors  || null}

    return ref.set(data)
                    .then((result) => {
                        res.json(data).status(200)
                        return 0;
                    })          
}



const deleteModel = (req,res)=>{
    const id = req.params.ID_MODELE

    return admin.firestore().collection("modeles")
                     .doc(id)
                     .delete()
                     .then(()=>{
                          //delete the versions
                          //delete the options tarifs
                          //delete the colors  tarifs
                          //delete the versions tarifs
                        res.json({id}).status(200)
                        return 0;
                     })
};


module.exports = {getModels ,
                  getModel ,
                  updateModel ,
                  deleteModel ,
                  setModel }
