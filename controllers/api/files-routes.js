const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
require('dotenv').config();

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
}
const s3Client = new S3Client({
    credentials: credentials,
    region: process.env.AWS_REGION
});

router.post('/uploadDiet', upload.single('uploaded-diet'), async (req, res) => {
    console.log('Upload diet route');
    console.log(req.file);
    const putObject = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `diets/${req.file.originalname}`,
        Body: req.file.buffer
    });
    const response =  await s3Client.send(putObject);
    console.log(response);
    res.status(200).json({message: 'Upload diet'});
});

router.post('/uploadTraining', (req, res) => {
    console.log('Upload training route');
    res.status(200).json({message: 'Upload training'});
});

router.post('/uploadProfileImage', (req, res) => {
    console.log('Upload image route');
    res.status(200).json({message: 'Upload image'});
});

module.exports = router;