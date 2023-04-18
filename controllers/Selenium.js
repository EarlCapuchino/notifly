const seleniumLogin = require("../config/seleniumLogin"),
  { By, Key } = require("selenium-webdriver");

const delay = ms => new Promise(res => setTimeout(res, ms));

exports.messages = async (req, res) => {
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  const { status, driver } = seleniumResponse;

  if (status) {
    await delay(10000);

    const { recipients, message } = req.body;

    var parsedMessage = message.replaceAll(
      "\n",
      Key.chord(Key.SHIFT, Key.ENTER)
    );

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      parsedMessage = parsedMessage.replaceAll(
        "@{nickname}",
        recipient.nickname || recipient.facebook
      );

      await driver.get(`https://facebook.com/messages/t/${recipient.customId}`);
      await delay(5000);
      await driver
        .findElement(By.css('div[aria-label="Message"]'))
        .sendKeys(parsedMessage, Key.RETURN);
      await delay(5000);
    }

    res.json({
      status: true,
      message: "Recipients messaged successfully",
    });
  } else {
    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
  driver.quit();
};
