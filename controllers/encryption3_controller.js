const express = require('express');
const { response, request } = require('express');
const crypto = require('crypto');

const secretKey = process.env.SECRETKEY; // Clave secreta de 32 bytes
const secretKey_IV = process.env.SECRETKEY_IV; // Clave secreta de 32 bytes para cifrar iv
const iv_static = process.env.IV; // Vector de inicialización estática de 16 bytes
const iv_static_0 = Buffer.alloc(16, 0); // IV constante de 16 bytes lleno de ceros

const encrypt = async (req = request, res = response) => {

    const { textToEncrypt } = req.body;
    const encryptedText = funEncrypt(textToEncrypt, secretKey, secretKey_IV, iv_static);

    res.status(201).json({
        ...encryptedText
    })
};

const decrypt = async (req = request, res = response) => {

    const { encryptedIV, encrypted } = req.body;
    const decryptedText = funDecrypt(encryptedIV, encrypted, secretKey, secretKey_IV, iv_static);

    res.status(201).json({
        decryptedText
    })
};

function funEncrypt(message, encryptionKey, ivEncryptionKey, iv_static) {
    const textEncoder = new TextEncoder();
    const key = textEncoder.encode(encryptionKey);
    const ivEncryptionKeyBuffer = textEncoder.encode(ivEncryptionKey);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = Buffer.concat([cipher.update(message), cipher.final()]).toString('base64');

    const ivCipher = crypto.createCipheriv('aes-256-cbc', ivEncryptionKeyBuffer, textEncoder.encode(iv_static));
    let encryptedIV = Buffer.concat([ivCipher.update(iv), ivCipher.final()]).toString('base64');

    const encryptedText = {
        encryptedIV,
        encrypted
    }

    return encryptedText;
}

function funDecrypt(encryptedIV, encryptedText, encryptionKey, ivEncryptionKey, iv_static) {
    const textEncoder = new TextEncoder();
    const key = textEncoder.encode(encryptionKey);
    const ivEncryptionKeyBuffer = textEncoder.encode(ivEncryptionKey);

    const ivCipher = crypto.createDecipheriv('aes-256-cbc', ivEncryptionKeyBuffer, textEncoder.encode(iv_static));
    let decryptedIV = ivCipher.update(Buffer.from(encryptedIV, 'base64'));
    const iv = decryptedIV.toString('base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(Buffer.from(encryptedText, 'base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}
