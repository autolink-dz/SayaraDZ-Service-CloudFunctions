const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");
const gcs = new Storage({
    keyFilename: 'sayaradz-75240-firebase-adminsdk-gcqog-920c418f0e.json'
});

const tmpdir  =  require("os").tmpdir
const join  = require("path").join

const fs = require("fs-extra")
const csv=require("csvtojson");

const processCarsCsvFile = (object)=>{
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const workingDir = join(tmpdir(), 'vehicules');
    const tmpFilePath = join(workingDir, 'vehicules.csv');
    const writeBatch =  admin.firestore().batch()
    const id = fileName.split(".")[0]
    const date  = new Date()
    const ref = admin.firestore().collection("vehicules").doc(id).collection(String(date.getTime()))

    return fs.ensureDir(workingDir)
                .then(() => {
                    return bucket.file(filePath).download({
                        destination: tmpFilePath }); 
                    })
                .then((result)=>{

                        return csv()
                                .fromFile(tmpFilePath)  
                                    
                })
                .then((jsonObject)=>{
                    objects  = jsonObject.forEach(object =>{
                        let options = object.options.split(',')
                        options.sort()
                        let document ={
                            num_chassi: object.num_chassi,
                            modele:  object.modele,
                            version: object.version,
                            couleur: object.couleur,
                            options,
                            disponible: true,
                            conscessionaier:object.conscessionaier      
                        }

                        let docRef  = ref.doc(document.num_chassi)
                        writeBatch.set(docRef,document)


                    })

                    return writeBatch.commit()
                })
                .catch((err)=>{
                    console.log(err);
                    
                })
}


module.exports = processCarsCsvFile