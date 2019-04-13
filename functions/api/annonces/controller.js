const admin = require("firebase-admin")

const setAnnounce = (req,res)=>{

    const body = req.body
    const data  = {
        id_proprietaire : body.id_proprietaire,
        id_marque: body.id_marque,
        id_modele: body.id_modele,
        id_version: body.id_version,
        disponible: true, 
        url: "",
        prix_min: parseFloat(body.prix_min),
        annee: body.annee,
        distance: parseFloat(body.distance),
        description: body.description,
        date:new Date()
    }

    let ref = admin.firestore().collection("annonces")
                               .doc()
    
    data.id = ref.id
   
    return ref.set(data)
              .then((result)=>{
                res.status(200).send(data)
                return 0
               })
              .catch((err)=>{
                res.status(500).send(err)
                return
              })

}

const getAnnounces = (req,res)=>{
    
    const next  = req.query.next 
    const page = req.query.page || 20
    const id_marque = req.query.id_marque || null
    const id_modele = req.query.id_modele || null
    const id_version = req.query.id_version || null
    const id_proprietaire = req.query.id_proprietaire || null
    const prix_max = req.query.prix_max || null
    const prix_min = req.query.prix_min || null
    const disponible = req.query.disponible || null

    let data = [];
    let users = []
    let versions = []
    let brands = []
    let models=[]

    let usersDocsPromise = []
    let versionsDocsPromise = []
    let modelsDocsPromise = []
    let brandsDocsPromise = []

    let snapshotPromise;
    let result

    let extras = {
        automobilistes:{},
        marques:{},
        modeles:{},
        versions:{}
    }

    let ref = admin.firestore()
                    .collection("annonces")
            
   
    if(id_marque) ref = ref.where("id_marque","==",id_marque)
    if(id_modele) ref = ref.where("id_modele","==",id_modele)
    if(id_version) ref = ref.where("id_version","==",id_version)
    if(id_proprietaire) ref = ref.where("id_proprietaire","==",id_proprietaire)
    if(disponible) ref = ref.where("disponible","==",(disponible == "true"))
    if(prix_max) ref = ref.where("prix_min","<=",parseFloat(prix_max))
    if(prix_min) ref = ref.where("prix_min",">=",parseFloat(prix_min))
    if(prix_max || prix_min) ref = ref.orderBy("prix_min")


    if(next != 0 ){

         snapshotPromise =  admin.firestore().collection("annonces").doc(next)
                              .get()
                              .then(doc => {
                                    return ref.startAfter(doc)
                                              .limit(parseInt(page))
                                              .get()})
     }else{

         snapshotPromise =  ref.limit(parseInt(page))
                               .get()
     }




     return  snapshotPromise.then(snapshot => {
                                     result = snapshot
                                     snapshot.docs.forEach(doc => {
                                                
                                                let annonce = doc.data()
                                                 annonce.date = annonce.date.toDate()
                                                
                                                 users.push(annonce.id_proprietaire)
                                                 versions.push(annonce.id_version)
                                                 models.push(annonce.id_modele)
                                                 brands.push(annonce.id_marque)

                                                 data.push(annonce)
                                                 
                                             })

                                             users = Array.from(new Set(users));
                                             versions = Array.from(new Set(versions));
                                             models = Array.from(new Set(models));
                                             brands = Array.from(new Set(brands));

                                             users.forEach(id =>{
                                                usersDocsPromise.push(admin.firestore().collection("automobilistes")
                                                                .doc(id)
                                                                .get())
                                            })
                
                                            brands.forEach(id=>{
                                                brandsDocsPromise.push(admin.firestore().collection("marques")
                                                                    .doc(id)
                                                                    .get()) 
                                            })

                                            models.forEach(id=>{
                                                modelsDocsPromise.push(admin.firestore().collection("modeles")
                                                                    .doc(id)
                                                                    .get()) 
                                            })
                
                                            versions.forEach(id=>{
                                                versionsDocsPromise.push(admin.firestore().collection("versions")
                                                                    .doc(id)
                                                                    .get()) 
                                            })
                                     
                                            return Promise.all(usersDocsPromise)
                                 })
                                 .then(docs => {
                        
                                    docs.forEach(doc => {
                                        let data   =  doc.data() 
                                        extras.automobilistes[data.id] = {
                                            id:data.id,
                                            email:data.email,
                                            nom: data.nom,
                                            photoURL: data.photoURL
                                        }
                                    })
                                    return Promise.all(brandsDocsPromise)
                                   
                                    })
                                   .then(docs => {
                        
                                    docs.forEach(doc => {
                                        let data = doc.data()
                                        extras.marques[data.id] = {
                                            id:data.id,
                                            nom: data.nom, 
                                            url: data.url
                                        }
                                    })
                            
                                    return Promise.all(modelsDocsPromise)
                                   })
                                   .then(docs => {
                        
                                    docs.forEach(doc => {
                                        let data   =  doc.data() 
                                        extras.modeles[data.id] = {
                                            id:data.id,
                                            nom: data.nom,
                                        }
                                    })

                                    return Promise.all(versionsDocsPromise)                           
                                    })
                                   .then(docs => {
                        
                                    docs.forEach(doc => {
                                        let data   =  doc.data() 
                                        extras.versions[data.id] = {
                                            id:data.id,
                                            nom: data.nom,
                                            photoURL: data.url
                                        } 
                                    })

                                     let next  = result.size > 0 ? result.docs[result.size-1].id : null
                                     res.status(200).json({next,data,extras})
                                     return 0;

                                   })
                                 .catch((err)=>{
                                    res.status(500).send(err)
                                    return 0;
                                })
            
}

const getAnnounce = (req,res)=>{

    const id = req.params.ID_ANNONCE
    
        
    return admin.firestore().collection("annonces")
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


module.exports = {
    setAnnounce,
    getAnnounces,
    getAnnounce
}