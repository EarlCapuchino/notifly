require("chromedriver");
const chrome = require("selenium-webdriver/chrome"),
  chromeOptions = new chrome.Options(),
  { By, Key, Builder } = require("selenium-webdriver");

module.exports = async (email, password) => {
  chromeOptions.addArguments("test-type");
  chromeOptions.addArguments("start-maximized");
  chromeOptions.addArguments("--js-flags=--expose-gc");
  chromeOptions.addArguments("--enable-precise-memory-info");
  chromeOptions.addArguments("--disable-popup-blocking");
  chromeOptions.addArguments("--disable-default-apps");
  chromeOptions.addArguments("--disable-infobars");
  chromeOptions.setUserPreferences({
    "profile.default_content_setting_values.notifications": 2,
  }); // this will block all the notifications
  driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  await driver.get("https://facebook.com");

  await driver.findElement(By.name("email")).sendKeys(email);
  await driver.findElement(By.name("pass")).sendKeys(password, Key.RETURN);

  return driver;
};
