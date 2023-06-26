const express = require('express');
const { response, request } = require('express');
const crypto = require('crypto');

const secretKey = process.env.SECRETKEY; // Clave secreta de 32 bytes
const iv = process.env.IV; // Vector de inicialización de 16 bytes


const encrypt = async (req = request, res = response) => {

    const { textToEncrypt } = req.body;
    const encryptedText = funEncrypt(textToEncrypt, secretKey);

    res.status(201).json({
        encryptedText
    })
};

const decrypt = async (req = request, res = response) => {

    const { encryptedText } = req.body;
    const decryptedText = funDecrypt(encryptedText, secretKey);


    res.status(201).json({
        decryptedText
    })
};

function funEncrypt(textToEncrypt, encryptionKey) {
    const textEncoder = new TextEncoder();
    const key = textEncoder.encode(encryptionKey);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const encryptedWithIv = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);

    return encryptedWithIv.toString('base64');
}

function funDecrypt(encrypted, encryptionKey) {
    const textEncoder = new TextEncoder();
    const key = textEncoder.encode(encryptionKey);
    const encryptedText = Buffer.from(encrypted, 'base64')

    const iv = encryptedText.subarray(0, 16)
    const encryptedTextWithoutIv = encryptedText.subarray(16)

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedTextWithoutIv, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

module.exports = {
    encrypt,
    decrypt
}