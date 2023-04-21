// Importing the necessary modules
const seleniumLogin = require("../config/seleniumLogin"),
  { By, Key, until } = require("selenium-webdriver");

// Function for sending messages to one or more Facebook users
exports.messages = async (req, res) => {
  console.log(">>selenium/messages");

  // Call the seleniumLogin function to log in to a Facebook account
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  // Check the status of the response
  const { status, driver } = seleniumResponse;

  // If login was successful
  if (status) {
    console.log(">>selenium/messages - fb login success");
    const { message, recipients } = req.body;

    try {
      // Loop through each recipient object in the recipients array
      for (const recipient of recipients) {
        // Replace all newline characters in the message with SHIFT+ENTER keystrokes and replace "@{nickname}" with the recipient's nickname or Facebook username
        var parsedMessage = message
          .replaceAll("\n", Key.chord(Key.SHIFT, Key.ENTER))
          .replaceAll("@{nickname}", recipient.nickname || recipient.facebook);

        // Construct the URL for the recipient's message thread and log it
        const url = `https://facebook.com/messages/t/${recipient.messengerId}`;
        console.log(`Processing URL: ${url}`);

        // Navigate to the recipient's message thread
        await driver.get(url);

        // Wait for the message input element to load and send the parsed message along with an ENTER keystroke to send the message
        const messageInput = await driver.wait(
          until.elementLocated(By.css('div[aria-label="Message"]'))
        );
        await messageInput.sendKeys(parsedMessage, Key.ENTER);

        console.log(`>>selenium/messages - ${url} success`);

        // Wait for a few seconds before sending the next message
        await driver.sleep(5000);
      }
    } catch (error) {
      console.log(`>>selenium/messages - ${url} error`);
      console.log(error.message);
    } finally {
      // Quit the browser driver when finished
      await driver.quit();
    }

    // Respond with a success message
    res.json({
      status: true,
      message: "Recipients messaged successfully",
    });
  } else {
    console.log(">>selenium/messages - fb login failed");
    // If login was unsuccessful, respond with an error message
    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};

// Function for tagging one or more Facebook users in a post or comment
exports.tagging = async (req, res) => {
  console.log(">>selenium/tagging");

  // Call the seleniumLogin function to log in to a Facebook account
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  // Check the status of the response
  const { status, driver } = seleniumResponse;

  // If login was successful
  if (status) {
    console.log(">>selenium/tagging - fb login success");

    const { recipients, message, url } = req.body;

    try {
      // Navigate to the Facebook page or post where the tagging will take place
      console.log(`Processing URL: ${url}`);
      await driver.get(url);

      // Wait for the comment input element to load and send the message along with a space to create a new comment
      const messageInput = await driver.wait(
        until.elementLocated(By.css('div[aria-label="Write a comment"]'))
      );

      await messageInput.sendKeys(`${message} `);

      // Loop through the recipients array and tag each username in a separate comment
      for (const recipient of recipients) {
        const { username } = recipient;

        // Send the recipient's username preceded by "@" and ENTER keystrokes to tag them in the comment
        await messageInput.sendKeys(`@${username}`);
        await driver.sleep(1000);
        await messageInput.sendKeys(Key.ENTER);
        await driver.sleep(1000);
        await messageInput.sendKeys(" ");

        console.log(`>>selenium/messages - ${username} success`);
      }

      // Send the message in the comment
      await messageInput.sendKeys(Key.ENTER);
    } catch (error) {
      console.log(`>>selenium/messages - ${username} failed`);
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.json({
      status: true,
      message: "Recipients tagged successfully",
    });
  } else {
    console.log(">>selenium/tagging - fb login failed");

    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};

exports.liking = async (req, res) => {
  console.log(">>selenium/liking");

  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  const { status, driver } = seleniumResponse;

  if (status) {
    console.log(">>selenium/liking - fb login success");

    const { urls } = req.body;

    try {
      for (const url of urls) {
        console.log(`Processing URL: ${url}`);
        await driver.get(url);

        const likeButton = await driver.wait(
          until.elementLocated(By.css('div[aria-label="Like"]'))
        );
        await likeButton.click();

        await driver.sleep(5000);

        console.log(`>>selenium/liking - ${url} success`);
      }
    } catch (error) {
      console.log(`>>selenium/liking - failed`);
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.json({
      status: true,
      message: "Recipients messaged successfully",
    });
  } else {
    console.log(">>selenium/liking - fb login failed");

    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};
