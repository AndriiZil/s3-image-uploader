const AWS = require('aws-sdk');
const { createReadStream } = require('fs');
const { basename } = require('path');

const { BUCKET_NAME, AWS_ACCESS_KEY_ID, SECRET_ACCESS_KEY } = require('./config');

class S3UploadService {

    constructor(awsAccessKeyId, secretAccessKey) {
        if (!S3UploadService.instance) {
            S3UploadService.instance = this;
            this.s3 = new AWS.S3();
            this.s3.config.update({
                accessKeyId: awsAccessKeyId,
                secretAccessKey: secretAccessKey
            });
        }
    }

    createBucket(bucketName) {
        return new Promise((resolve, reject) => {
            this.s3.createBucket({
                Bucket: bucketName,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                return resolve(data);
            });
        });
    }

    putObject(bucketName, filePath) {
        const fileName = `avatar/${Date.now()}_${basename(filePath)}`;
        const params = this.getUploadParams(bucketName, filePath, fileName);

        return new Promise((resolve, reject) => {
            this.s3.putObject(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                return resolve(`https://bucket-car-express.s3.amazonaws.com/${params.Key}`);
            });
        })
    }

    getUploadParams(bucketName, filePath, fileName) {
        return {
            Bucket: bucketName,
            Body : createReadStream(filePath),
            Key : fileName,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        }
    }

}

const s3 = new S3UploadService(AWS_ACCESS_KEY_ID, SECRET_ACCESS_KEY);

async function create() {
    await s3.createBucket(BUCKET_NAME);
    return s3.putObject(BUCKET_NAME, './data/download.jpeg');
}

create().then(console.log)

