const admin = require("firebase-admin")


const setSubscrptionState  = (req,res)=>{
    const type = req.params.TYPE
    const id = req.params.ID
    const uid = req.body.id_automobiliste
    


    const ref = admin.firestore().collection("automobilistes")
                                  .doc(uid)
   return ref.get()
            .then(doc => {
                        
                let data   = doc.data()
                let items =  data[type]

                if (req.method == 'POST') 
                     items.push(id) 
                else 
                     items.splice(items.indexOf(id), 1);

                data = {}
                data[type] = items

                return ref.update(data);
             })
            .then((result) => {
                res.status(200).json({})
                return 0;
            })
            .catch((err)=>{
                res.status(500).send(err)
                return 0;
            })
                    
}

const setNotificationToken = (req,res)=>{

    const uid  = req.params.ID 
    const instance_token = req.body.instance_token

    return admin.firestore().collection("automobilistes")
                            .doc(uid)
                            .update({instance_token})
                            .then(res => {
                                res.status(200)
                                return 0;
                            })
                            .catch((err)=>{
                                res.status(500).send(err)
                                return 0;
                            })
}
module.exports = { setSubscrptionState , setNotificationToken}