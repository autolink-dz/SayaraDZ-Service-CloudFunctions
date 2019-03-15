const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");
const gcs = new Storage({
    keyFilename: 'sayaradz-75240-firebase-adminsdk-gcqog-920c418f0e.json'
});

const tmpdir  =  require("os").tmpdir
const join  = require("path").join

const fs = require("fs-extra")
const csv=require("csvtojson");

const processPricesCsvFile = (object)=>{
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const workingDir = join(tmpdir(), 'tarifs');
    const tmpFilePath = join(workingDir, 'tarif.csv');
    const writeBatch =  admin.firestore().batch()
    const id = fileName.split(".")[0]
    const date  = new Date()
    const ref = admin.firestore().collection("tarifs").doc(id).collection(String(date.getTime()))

    return fs.ensureDir(workingDir)
                .then(() => {
                    return bucket.file(filePath).download({
                        destination: tmpFilePath }); 
                })
                .then(result=>{

                        return csv()
                                .fromFile(tmpFilePath)  

                
                                       
                })
                .then((jsonObject)=>{
                
                    jsonObject.forEach(object =>{
                        let type;
                        
                        switch (object.type) {
                            case "0":
                                type = "version"    
                                break;

                            case "1":
                                type = "couleur"    
                                break;

                            case "2":
                                type = "option"    
                                break;
                            
                            default:
                                break;
                        }
                        
                        let docRef  = ref.doc()

                        let document =  {
                                id: docRef.id,
                                modele: object.modele,
                                type,  
                                code: object.code,
                                prix: parseFloat(object.prix),
                                date_debut: new Date(object.date_debut),
                                date_fin: new Date(object.date_fin)
                            }
                        
                        writeBatch.set(docRef,document)
                    
                    })
                    
                    return writeBatch.commit()
               
                })
                .catch((err)=>{
                    console.log(err);
                    
                })
              
}


module.exports = processPricesCsvFile