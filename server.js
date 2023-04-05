const express = require('express');
const request = require('request-promise-native');
const sharp = require('sharp');
const solveCaptcha = require('./solveCaptcha');

const app = express();

app.use(express.json());

app.post('/solve-captcha', async(req, res) => {

    const captchaUrl = req.body.url;

    // Fetch the captcha image
    let captchaBuffer = null;
    try {
        captchaBuffer = await request.get({ url: captchaUrl, encoding: null });
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed to fetch captcha');
        return;
    }
    let captchaImage = null;
    try {
        captchaImage = await sharp(captchaBuffer)
            .resize(200)
            .toBuffer();
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to process captcha image');
        return;
    }
    let captcha = null;

    try {
        captcha = await solveCaptcha(captchaImage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to solve captcha');
        return;
    }
    // Return the solved captcha
    res.json({ captcha });
});
app.listen(8000, () => {
    console.log('Server started on port 8000');
});
