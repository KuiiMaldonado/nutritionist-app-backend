const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
}
const s3Client = new S3Client({
    credentials: credentials,
    region: process.env.AWS_REGION
});

router.get('/downloadDiet', async (req, res) => {
    console.log('Get diet route');
    const getObject = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: 'diets/636f098983954fa8931408a8/Cuitlahuac Maldonado (2007.2 kcal) 10-11-22.pdf'
    });
    const url = await getSignedUrl(s3Client, getObject, {expiresIn: 60*5});
    console.log(url);
    res.status(200).json({message: 'Get diet'});
});

router.post('/uploadDiet', upload.single('uploaded-diet'), async (req, res) => {
    const putObject = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `diets/${req.body.userId}/${req.file.originalname}`,
        Body: req.file.buffer
    });
    const response =  await s3Client.send(putObject);
    res.status(response.$metadata.httpStatusCode).json({response: response, fileName: req.file.originalname});
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