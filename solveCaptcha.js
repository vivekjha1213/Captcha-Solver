const puppeteer = require('puppeteer');
const request = require('request-promise-native');

const solveCaptcha = async(imageUrl) => {
    // Start headless Chrome browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the captcha image URL
    await page.goto(imageUrl);

    // Get the image dimensions
    const dimensions = await page.evaluate(() => {
        const img = document.querySelector('img');
        return { width: img.width, height: img.height };
    });

    // Take a screenshot of the image
    await page.setViewport(dimensions);
    const screenshot = await page.screenshot({ type: 'png' });

    // Api Key :---
    // Link: --https: //anti-captcha.com/apidoc

    const apiKey = '874eaa97b6eca89be0466b77870ac146';
    const url = `https://api.anti-captcha.com/createTask?clientKey=${apiKey}&task=imageToText&phrase=true&caseSensitive=false&bodyBase64=${screenshot.toString('base64')}`;
    const response = await request.post(url, { json: true });


    let result = null;
    while (result === null || result.status !== 'ready') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const taskId = response.taskId;
        const checkUrl = `https://api.anti-captcha.com/getTaskResult?clientKey=${apiKey}&taskId=${taskId}`;
        result = await request.get(checkUrl, { json: true });
    }


    return result.solution.text;
};

// Usage example
// solveCaptcha('https://www.apowersoft.com/free-screen-capture.png')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));