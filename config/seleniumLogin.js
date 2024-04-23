require("chromedriver");
const chrome = require("selenium-webdriver/chrome"),
  chromeOptions = new chrome.Options(),
  { By, Key, Builder } = require("selenium-webdriver");

module.exports = (email, password) => {
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

  return driver
    .get("https://facebook.com")
    .then(async () => {
      await driver.findElement(By.name("email")).sendKeys(email);
      await driver.findElement(By.name("pass")).sendKeys(password, Key.RETURN);

      return driver
        .findElement(By.css('div[class="_9ay7"]'))
        .then(() => {
          return { status: false, message: "Invalid Credentials", driver };
        })
        .catch(async () => {
          // await driver.sleep(10000); comment out for slow internet connection

          return driver
            .findElements(
              By.css(
                'span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft"]'
              )
            )
            .then(async elements => {
              if (elements && elements.length > 0) {
                const value = await elements[1].getAttribute("innerText");
                return { status: true, content: value, driver };
              } else {
                return { status: false, message: "Cannot find Name", driver };
              }
            })
            .catch(() => {
              return { status: false, message: "Cannot find Elements", driver };
            });
        });
    })
    .catch(err => {
      return {
        status: false,
        message: err.message,
        driver,
      };
    });
};
