// const chromium = require('chrome-aws-lambda');

// exports.handler = async (event, context) => {

// let pageToScreenshot;

// if (event && event.body) {
//     pageToScreenshot = JSON.parse(event.body).pageToScreenshot;
// }

// pageToScreenshot = pageToScreenshot ? pageToScreenshot : "https://docsie.io";


// if (!pageToScreenshot) return {
//     statusCode: 400,
//     body: JSON.stringify({ message: 'Page URL not defined' })
// }

// const browser = await chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: chromium.headless,
// });

// const page = await browser.newPage();

// await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

// const screenshot = await page.screenshot({ encoding: 'binary' });

// await browser.close();

// return {
//     statusCode: 200,
//     body: JSON.stringify({ 
//         message: `Complete screenshot of ${pageToScreenshot}`, 
//         buffer: screenshot 
//     })
// }

// }

const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {
    let theTitle = null
    let browser = null
    console.log('spawning chrome headless')
    try {
        let pageToScreenshot;

        const executablePath = await chromium.executablePath

        console.log("executablePath", executablePath);

        if (event && event.body) {
            pageToScreenshot = JSON.parse(event.body).pageToScreenshot;
        }

        pageToScreenshot = pageToScreenshot ? pageToScreenshot : "https://docsie.io";


        if (!pageToScreenshot) return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Page URL not defined' })
        }

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

        const screenshot = await page.screenshot({ encoding: 'binary' });

        await browser.close();

    } catch (error) {
        console.log('error', error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error
            })
        }
    } finally {
        // close browser
        if (browser !== null) {
            await browser.close()
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Complete screenshot of ${pageToScreenshot}`,
            buffer: screenshot
        })
    }
}
