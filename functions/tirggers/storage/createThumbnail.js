
const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");
const gcs = new Storage({
    keyFilename: 'sayaradz-75240-firebase-adminsdk-gcqog-920c418f0e.json'
});

const tmpdir  =  require("os").tmpdir
const join  = require("path").join
const dirname  = require("path").dirname

const sharp = require("sharp")
const fs = require("fs-extra")


const createThumbnail = (object)=>{
    
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const bucketDir = dirname(filePath);
    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.png');

    if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
        console.log('exiting function');
        return false;
    }

    return fs.ensureDir(workingDir)
                .then((result) => {
                    return bucket.file(filePath).download({
                        destination: tmpFilePath }); 
                    })
                .then((result)=>{
                    
                    // create first thumbnail
                        const thumbName = `thumb@${256}_${fileName}`;
                        const thumbPath = join(workingDir, thumbName);

                        return sharp(tmpFilePath)
                                .resize(256, 256)
                                .toFile(thumbPath)
                })
                .then(()=>{
                    const thumbName = `thumb@${256}_${fileName}`;
                    const thumbPath = join(workingDir, thumbName);
                    return bucket.upload(thumbPath, {
                        destination: join(bucketDir, thumbName)
                      });
                })
                .then(() => {
                        /**
                         * getting the signed url from the google cloud storage bucker 
                         */
                      
                        const thumbName = `thumb@${256}_${fileName}`;
                        const thumbPath = join(bucketDir, thumbName);
                        const thumbFile = bucket.file(thumbPath);
                        const config = {
                            action: "read",
                            expires: "12-12-2222"
                        }
                        return thumbFile.getSignedUrl(config)
                })
                .then(url => {
                        
                        /**
                         * setting the photo url on firebase firestore
                         */

                        let ref;
                        let resDirectoryName  = filePath.split('/')[1]
                        let key = fileName.split(".")[0]
                        if(resDirectoryName == "versions") {
                            let modelID = key.split("_")[0]
                            let versionID = key.split("_")[1]
                            ref = admin.firestore().collection("modeles").doc(modelID)
                                                        .collection("version")
                                                        .doc(versionID)
                                                        
                        
                        }else{
                            let collectionType = resDirectoryName
                            let documentId = key
                            ref = admin.firestore().collection(collectionType).doc(documentId)
                        }
                        console.log("the image url is"+url);
                        
                        return ref.update({ url: url.pop() })  
                    })
                }


module.exports = createThumbnail