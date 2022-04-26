const crypto = require('crypto');

const AES256 = 'aes-256-ctr';
const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const initialisationVector = crypto.randomBytes(16);

const encrypt = (data) => {

    const cpr = crypto.createCipheriv(AES256, key, initialisationVector);

    const data_encrypted = Buffer.concat([cpr.update(data), cpr.final()]);

    return {
        initialisationVector: initialisationVector.toString('hex'),
        hashedData: data_encrypted.toString('hex')
    };
};

const decrypt = (data) => {

    const dcpr= crypto.createDecipheriv(AES256, key, Buffer.from(data.initialisationVector, 'hex'));

    const data_decrpyted = Buffer.concat([dcpr.update(Buffer.from(data.hashedData, 'hex')), dcpr.final()]);

    return data_decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};