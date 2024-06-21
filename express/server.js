import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { randomBytes } from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from '@prisma/client';

dotenv.config();

const randomImageName = (bytes = 32) => randomBytes(bytes).toString('hex');

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccesskey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccesskey,
    },
    region: bucketRegion,
})

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const prisma = new PrismaClient();

app.get('/api/posts', async (req, res) => {
    const posts = await prisma.posts.findMany({ orderBy: [{ created: 'desc' }] });
    for(const post of posts) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: post.imageName
        }
        const cmd = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, cmd, {expiresIn: 3600}); //in sec
        post.imageUrl = url;
    }
    res.send(posts);
})

app.post('/api/posts', upload.single('image'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();

    const imageName = randomImageName();
    // update s3
    const params = {
        Bucket: bucketName,
        Key: imageName, // needs to be unique as to avoid overriding
        Body: buffer,
        ContentType: req.file.mimetype,
    }
    const cmd = new PutObjectCommand(params);
    await s3.send(cmd);
    // update prisma
    const post = await prisma.posts.create({
        data: {
            caption: req.body.caption,
            imageName: imageName
        }
    })

    res.send(post);
})

app.delete('/api/posts/:id', async (req, res) => {
    const id = +req.params.id;
    const post = await prisma.posts.findUnique({where: {id}});
    if(!post) {
        res.status(404).send('Post not found');
        return;
    }
    // update s3
    const params = {
        Bucket: bucketName,
        Key: post.imageName
    }
    const cmd = new DeleteObjectCommand(params)
    await s3.send(cmd);
    //update prisma
    await prisma.posts.delete({where: {id}});
    res.send({});
})

app.listen(8080, () => {
    console.log('listening to port 8080');
})