const dotenv = require('dotenv');

const { error } = dotenv.config();

if (error) {
    throw error;
}

module.exports = {
    BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
}
