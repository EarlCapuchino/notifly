const seleniumLogin = require("../config/seleniumLogin"),
  { By, Key, until } = require("selenium-webdriver");

exports.messages = async (req, res) => {
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  const { status, driver } = seleniumResponse;

  if (status) {
    const { message, recipients } = req.body;

    try {
      // Loop through the recipients array and open each URL
      for (const recipient of recipients) {
        var parsedMessage = message
          .replaceAll("\n", Key.chord(Key.SHIFT, Key.ENTER))
          .replaceAll("@{nickname}", recipient.nickname || recipient.facebook);

        const url = `https://facebook.com/messages/t/${recipient.messengerId}`;
        console.log(`Processing URL: ${url}`);
        await driver.get(url);

        // Wait for the "Message" element to appear and send the message
        const messageInput = await driver.wait(
          until.elementLocated(By.css('div[aria-label="Message"]'))
        );
        await messageInput.sendKeys(parsedMessage, Key.ENTER);

        // wait for the message to be sent
        await driver.sleep(5000);
      }
    } finally {
      await driver.quit();
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
};

exports.tagging = async (req, res) => {
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  const { status, driver } = seleniumResponse;

  if (status) {
    const { recipients, message, url } = req.body;

    try {
      console.log(`Processing URL: ${url}`);
      await driver.get(url);

      // Wait for the "Write a comment" element to appear and send the message
      const messageInput = await driver.wait(
        until.elementLocated(By.css('div[aria-label="Write a comment"]'))
      );

      await messageInput.sendKeys(`${message} `);

      // Loop through the recipients array and tag each username
      for (const recipient of recipients) {
        const { username } = recipient;

        await messageInput.sendKeys(
          `@${username.slice(0, username.length - 1)}`
        );
        await driver.sleep(1000);
        await messageInput.sendKeys(Key.ENTER);
      }

      await messageInput.sendKeys(Key.ENTER);
    } finally {
      await driver.quit();
    }

    res.json({
      status: true,
      message: "Recipients tagged successfully",
    });
  } else {
    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
  // driver.quit();
};
