const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
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

router.post('/downloadDiet', async (req, res) => {
    try {
        const getObject = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `diets/${req.body.userId}/${req.body.fileName}`
        });
        const url = await getSignedUrl(s3Client, getObject, {expiresIn: 60*5});
        res.status(200).json({download: url});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
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

router.post('/deleteDiet', async (req, res) => {
    const deleteObject = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `diets/${req.body.userId}/${req.body.fileName}`
    });
    const response = await s3Client.send(deleteObject);
    res.status(response.$metadata.httpStatusCode).send();
});

router.post('/downloadTraining', async (req, res) => {
    try {
        const getObject = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `trainings/${req.body.userId}/${req.body.fileName}`
        });
        const url = await getSignedUrl(s3Client, getObject, {expiresIn: 60*5});
        res.status(200).json({download: url});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

router.post('/uploadTraining', upload.single('uploaded-training'), async (req, res) => {
    const putObject = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `trainings/${req.body.userId}/${req.file.originalname}`,
        Body: req.file.buffer
    });
    const response =  await s3Client.send(putObject);
    res.status(response.$metadata.httpStatusCode).json({response: response, fileName: req.file.originalname});
});

router.post('/deleteTraining', async (req, res) => {
    const deleteObject = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `trainings/${req.body.userId}/${req.body.fileName}`
    });
    const response = await s3Client.send(deleteObject);
    res.status(response.$metadata.httpStatusCode).send();
});

router.post('/uploadProfilePicture', upload.single('uploaded-picture'), async (req, res) => {
    const putObject = new PutObjectCommand({
        Bucket: process.env.AWS_S3_PICTURES_BUCKET,
        Key: `${req.body.userId}-profilePicture`,
        Body: req.file.buffer
    });
    const response =  await s3Client.send(putObject);
    console.log(response.Location);
    res.status(response.$metadata.httpStatusCode).json({response: response, fileName: req.file.originalname});
});

module.exports = router;