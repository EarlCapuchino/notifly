require("chromedriver");
const chrome = require("selenium-webdriver/chrome"),
  chromeOptions = new chrome.Options(),
  { By, Key, Builder } = require("selenium-webdriver");

module.exports = async (email, password, initial = false) => {
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

  try {
    await driver.get("https://facebook.com");
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("pass")).sendKeys(password, Key.RETURN);

    const element = await driver.findElement(By.css('div[class="_9ay7"]'));

    if (element) {
      return { status: false, message: "Invalid Credentials", driver };
    }
  } catch (error) {
    if (initial) {
      try {
        const elements = await driver.findElements(
          By.css(
            'span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft"]'
          )
        );

        if (elements.length > 0) {
          const value = await elements[1].getAttribute("innerText");

          return { status: true, content: value, driver };
        }
      } catch (error) {
        return { status: false, message: "Cannot find name", driver };
      }
    } else {
      return { status: true, driver };
    }
  }
};
