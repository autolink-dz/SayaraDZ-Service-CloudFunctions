const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");
const gcs = new Storage({
    keyFilename: 'sayaradz-75240-firebase-adminsdk-gcqog-920c418f0e.json'
});

const tmpdir  =  require("os").tmpdir
const join  = require("path").join
const dirname  = require("path").dirname

const fs = require("fs-extra")
const csv=require("csvtojson");

const processPricesCsvFile = (object)=>{
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'price.csv');
    const deleteBatch =  admin.firestore().batch()
    const writeBatch =  admin.firestore().batch()
    const id = fileName.split(".")[0]
    const ref = admin.firestore().collection("marques").doc(id).collection("tarifs")
    var objects

    return fs.ensureDir(workingDir)
                .then((result) => {
                    return bucket.file(filePath).download({
                        destination: tmpFilePath }); 
                    })
                .then((result)=>{

                        return csv()
                                .fromFile(tmpFilePath)  
                                       
                }).then((jsonObject)=>{
                    
                    objects  = jsonObject.map(object =>{
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

                        return {
                            modele: object.modele,
                            type,  
                            code: object.code,
                            prix: parseFloat(object.prix),
                            date_debut: new Date(object.date_debut),
                            date_fin: new Date(object.date_fin)
                        }
                    
                    
                    })

                    return  ref.listDocuments()
                })
                
                .then(res => {
                    console.log("Deleting the old price documents for the brand with id "+id);
                    res.map((doc) => {
                        deleteBatch.delete(doc)
                    })
                    return deleteBatch.commit()
                })
                .then(()=>{
                    console.log("creating the new price documents for the brand with id "+id);
                    objects.forEach(object => {
                        let docRef  = ref.doc()
                        writeBatch.set(docRef,object)
                    });
                    
                    return writeBatch.commit()

                })
}


module.exports = processPricesCsvFile