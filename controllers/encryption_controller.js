const express = require('express');
const { response, request } = require('express');
const crypto = require('crypto');

const secretKey = process.env.SECRETKEY; // Clave secreta de 32 bytes
const iv = process.env.IV; // Vector de inicialización de 16 bytes

const encrypt = async (req = request, res = response) => {

    const { originalText } = req.body;
    const encryptedText = funEncrypt(originalText, secretKey, iv);

    res.status(201).json({
        encryptedText
    })
};

const decrypt = async (req = request, res = response) => {

    const { encryptedText } = req.body;
    const decryptedText = funDecrypt(encryptedText, secretKey, iv);

    res.status(201).json({
        decryptedText
    })
};

// Función para encriptar texto
function funEncrypt(text, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Función para desencriptar texto
function funDecrypt(encrypted, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}