// Chrome driver
require("chromedriver");
require('dotenv').config();
const delay = ms => new Promise(res => setTimeout(res, ms));
const {By, Key, Builder, until, EC, WebDriverWait} = require("selenium-webdriver");

// async function login(){
//     var webdriver = require("selenium-webdriver");
//     var chrome = require("selenium-webdriver/chrome");
//     var chromeOptions = new chrome.Options();
//     chromeOptions.addArguments("test-type");
//     chromeOptions.addArguments("start-maximized");
//     chromeOptions.addArguments("--js-flags=--expose-gc");
//     chromeOptions.addArguments("--enable-precise-memory-info");
//     chromeOptions.addArguments("--disable-popup-blocking");
//     chromeOptions.addArguments("--disable-default-apps");
//     chromeOptions.addArguments("--disable-infobars");
//     chromeOptions.setUserPreferences({'profile.default_content_setting_values.notifications': 2});// this will block all the notifications
//     driver = new webdriver.Builder()
//                 .forBrowser("chrome")
//                 .setChromeOptions(chromeOptions)
//                 .build();

//     await driver.get("https://facebook.com");
//     await driver.findElement(By.name("email")).sendKeys(process.env.EMAIL);
//     await driver.findElement(By.name("pass")).sendKeys(process.env.PASSWORD, Key.RETURN);

//     return driver
// }

// async function deployMessageGC(driver, message){
//     let by = By.css('div[aria-label="Message"]');
//     el = await driver.wait(until.elementLocated(by, 10000))
//     el = driver.findElement(by);
//     driver.wait(until.elementIsVisible(el), 10000);
//     el.sendKeys(message, Key.RETURN);
// }

// async function deployPostInGroup(driver, postMessage){

//     let by = By.xpath("//*[contains(text(),'Write something...')]");
//     el = await driver.wait(until.elementLocated(by, 10000))
//     el = driver.findElement(by);
//     driver.wait(until.elementIsVisible(el), 10000);
//     await delay(2000)
//     el.click()
    
//     let by2 = By.css('div[class="_1mf _1mj"]')
//     el2 = await driver.wait(until.elementLocated(by2, 10000))
//     el2 = driver.findElement(by2);
//     driver.wait(until.elementIsVisible(el2), 10000);
//     await delay(2000)
//     el2.sendKeys(postMessage)

//     let byPost = By.css('div[aria-label="Post"]');
//     elPost = await driver.wait(until.elementLocated(byPost, 2000))
//     elPost = driver.findElement(byPost);
//     driver.wait(until.elementIsVisible(elPost), 2000);
//     await delay(2000)
//     elPost.click();
//     await delay(5000)
// }

// async function sendMessageGC(message, recipients){
//     var driver = await login();
//     await delay(10000)
//     for (let i = 0; i < recipients.length; i++) {
//         message = message.replaceAll("\n", Key.chord(Key.SHIFT, Key.ENTER));
//         await driver.get(`${recipients[i]}`)
//         await delay(10000)
//         deployMessageGC(driver, message)
//         await delay(10000)
//     }
// }

// async function postInGroup(postMessage, groups){
//     var driver = await login();
//     await delay(10000)
//     for (let i = 0; i < groups.length; i++) {
//         postMessage = postMessage.replaceAll("\n", Key.chord(Key.SHIFT, Key.ENTER));
//         await driver.get(`${groups[i]}`)
//         await delay(10000)
//         deployPostInGroup(driver, postMessage)
//         await delay(10000)
 
//     }
// }

// message = "Trying if this will work in group chat"
// urls = ["https://www.facebook.com/messages/t/8894145867325329", "https://www.facebook.com/messages/t/6140387632693769"]
// sendMessageGC(message, urls)

// postMessage = "It always concatenate, I do not know why" 
// urls = ["https://www.facebook.com/groups/2196066893899400", "https://www.facebook.com/groups/1281161189141140"]
// postInGroup(postMessage, urls)

var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var chromeOptions = new chrome.Options();
// chromeOptions.addArguments("test-type");
// chromeOptions.addArguments("start-maximized");
// chromeOptions.addArguments("--js-flags=--expose-gc");
// chromeOptions.addArguments("--enable-precise-memory-info");
// chromeOptions.addArguments("--disable-popup-blocking");
// chromeOptions.addArguments("--disable-default-apps");
// chromeOptions.addArguments("--disable-infobars");
// chromeOptions.setUserPreferences({'profile.default_content_setting_values.notifications': 2});// this will block all the notifications
chromeOptions.addArguments("user-data-dir=C:\\tmp")
// chromeOptions.addArguments("profile-directory=Profile 1")
// driver = new webdriver.Builder()
//             .forBrowser("chrome")
//             .setChromeOptions(chromeOptions)
//             .build();

// driver.get("https://gmail.com");


const nodemailer = require("nodemailer");

async function main() {

    const nodemailer = require("nodemailer");

    const client = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "Your email",
            pass: "Google App Password Without Spaces"
        }
    });
    
    client.sendMail(
        {
            from: "sender",
            to: "recipient",
            subject: "Sending",
            text: "Hello"
        }
    )
    
}

main()
.catch(err => console.log(err));
