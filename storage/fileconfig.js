const Grid = require('gridfs-stream');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const MART_BUCKET  ="uploads";


let gfs;
const InitializeStorage = (mongoURI, db, mongo) =>{
    gfs = Grid(db, mongo);
    gfs.collection(MART_BUCKET);

    const martStorage = new GridFsStorage({
        url: mongoURI, 
        file: (req, file) =>{
          
            return new Promise((resolve, reject) =>{
                require('crypto').randomBytes(16, (err, buf) =>{
                    if(err){
                        return reject(err);
                    }
                    const filename = buf.toString('hex') +  path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename, 
                        bucketName: MART_BUCKET
                    };
                    resolve(fileInfo);
                })
            })
        }
    })
   return martStorage
}
module.exports = {
   InitializeStorage, 
}