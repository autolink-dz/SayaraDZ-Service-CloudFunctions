const admin = require("firebase-admin");


const setCarProvider = (req,res)=>{
    const body  = req.body;
    const user = {
        nom: body.nom,
        prenom: body.prenom,
        mail: body.mail,
        mdp: body.mdp,
        num_tlp: body.num_tlp,
        id_marque: body.id_marque,
        adresse:body.adresse,
        disabled: false
    }; 
                     
    return admin.auth().createUser({
        email: user.mail,
        emailVerified: false,
        phoneNumber: user.num_tlp,
        password: user.mdp,
        displayName: user.prenom + " " + user.nom,
        disabled: false
        })
        .then((userRecord)=> {
            console.log(userRecord);
            user.id = userRecord.uid
            return admin.firestore().collection("fabricants")
                        .doc(user.id)
                        .set(user)
        })
        .then((result) => {
            res.status(200).json(user)
            return 0;
        })
        .catch((err)=>{
            res.status(500).send(err)
            return 0;
        })
}

const getCarProviders = (req,res)=>{
    let data = [];
    const id_marque  = req.query.id_marque || null
    let ref;

    let source = admin.firestore().collection("fabricants")
    if (id_marque) 
            ref = source.where("id_marque","==",id_marque); 
    else 
            ref = source.orderBy("id_marque")

    return  ref.get()
        .then(snapshot => {
                snapshot.docs.forEach(doc => {
                            data.push(doc.data())
                        })

                res.status(200).json({data})
                return 0;
            })
            .catch((err)=>{
                res.status(500).send(err)
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
                    .catch((err)=>{
                        res.status(500).send(err)
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
                    .catch((err)=>{
                        res.status(500).send(err)
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
                 .catch((err)=>{
                    res.status(500).send(err)
                    return 0;
                })
};


module.exports = {setCarProvider,
                  getCarProviders,
                  getCarProvider,
                  updateCarProvider,
                  deleteCarProvider}