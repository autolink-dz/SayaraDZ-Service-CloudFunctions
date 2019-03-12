const admin = require("firebase-admin");



const getCarProviders = (req,res)=>{
    let data = [];
    const next  = req.query.next 
    const page = req.query.page || 20
    const id_marque  = req.query.id_marque || null
    let snapshotPromise;
    let ref;

    let source = admin.firestore().collection("fabricants")
    if (id_marque) 
            ref = source.where("id_marque","==",id_marque); 
    else 
            ref = source.orderBy("id_marque")

   if(next != 0){
        snapshotPromise = source.doc(next)
                                .get()
                                .then(doc => {
                                    return ref.startAfter(doc)
                                              .limit(parseInt(page))
                                              .get()})
   }else{
        snapshotPromise = ref.limit(parseInt(page))
                             .get()
   }

    return  snapshotPromise .then(snapshot => {
                snapshot.docs.forEach(doc => {
                            data.push(doc.data())
                        })

                let next  = snapshot.size > 0 ? snapshot.docs[snapshot.size-1].id : null
                res.status(200).json({next,data})
                return 0;
            })
            
           
    }

const getCarProvider  = (req,res)=>{
    const id = req.params.ID_FABRIQUANT
    
   return admin.firestore().collection("fabricants")
                    .doc(id)
                    .get()
                    .then(doc => {
                        res.status(200).json(doc.data())
                        return 0;
                    })
                    
}

const updateCarProvider = (req,res)=>{
    const id = req.params.ID_FABRIQUANT
    const body  = req.body

    return admin.firestore().collection("fabricants")
                    .doc(id)
                    .update(body)
                    .then((result) => {
                        body.id = id 
                        if(body.disabled == undefined){
                            res.json(body).status(200)
                            return 0;
                        }else{
                            return admin.auth().updateUser(id, {
                                disabled: body.disabled
                            })
                        }})
                    .then((result)=>{
                            res.status(200).json(body)
                                return 0;
                    })
                    
                  
}

const deleteCarProvider = (req,res)=>{
    const id = req.params.ID_FABRIQUANT

     return admin.firestore().collection("fabricants")
                 .doc(id)
                 .delete()
                 .then(()=>{
                     return admin.auth().deleteUser(id)
                 })
                 .then(()=>{
                    res.json({id}).status(200)
                    return 0;
                 })
};

const setCarProvider = (req,res)=>{
    let body  = req.body
    let user = {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        num_tel: body.num_tel,
        id_marque: body.id_marque,
        disabled: false
    }
    

    return admin.auth().createUser({
            email: user.email,
            password: body.password,
            displayName: user.prenom+" "+user.nom,
            disabled: user.disabled})
        .then(function(userRecord) {
            user.id = userRecord.uid
            return admin.firestore().collection("fabricants")
                        .doc(user.id)
                        .set(user)
            .then((result) => {
                res.status(200).json(user)
                return 0;
            })})
}

module.exports = {getCarProviders,
                  getCarProvider,
                  updateCarProvider,
                  deleteCarProvider,
                  setCarProvider}