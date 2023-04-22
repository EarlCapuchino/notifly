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

    var response = {
      code: 200,
      status: true,
      message: "Members messaged successfully",
    };

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

        if (messageInput) {
          await messageInput.sendKeys(parsedMessage, Key.ENTER);

          console.log(`>>selenium/messages - ${url} success`);

          // Wait for a few seconds before sending the next message
          await driver.sleep(5000);
        }
      }
    } catch (error) {
      console.log(`>>selenium/messages - ${url} error`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      // Quit the browser driver when finished
      await driver.quit();
    }

    // Respond with a success message
    res.status(response.code).json(response);
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

    var response = {
      code: 200,
      status: true,
      message: "Members tagged successfully",
    };

    try {
      // Navigate to the Facebook page or post where the tagging will take place
      console.log(`Processing URL: ${url}`);
      await driver.get(url);

      // Wait for the comment input element to load and send the message along with a space to create a new comment
      const messageInput = await driver.wait(
        until.elementLocated(By.css('div[aria-label="Write a comment"]'))
      );

      if (messageInput) {
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
      }
    } catch (error) {
      console.log(`>>selenium/messages - ${username} failed`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.status(response.code).json(response);
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

    const { urls, ariaLabel } = req.body;

    var response = {
      code: 200,
      status: true,
      message: "Posts liked successfully",
    };

    try {
      for (const url of urls) {
        try {
          console.log(`Processing URL: ${url}`);
          await driver.get(url);

          const removeLike = await driver.findElement(
            By.css(`div[aria-label="${ariaLabel}"]`)
          );

          if (removeLike) {
            console.log("Already liked");
          }
        } catch (error) {
          // this error states that Remove like is not found, so it is available for liking
          console.log(error.message);

          try {
            const like = await driver.findElement(
              By.css('div[aria-label="Like"]')
            );

            if (like) {
              await like.click();

              await driver.sleep(5000);

              console.log(`>>selenium/liking - ${url} success`);
            }
          } catch (error) {
            console.log(error.message);
          }
        }

        // const likeButton = driver.wait(
        //   until.elementLocated(By.css('div[aria-label="Like"]'))
        // );
      }
    } catch (error) {
      console.log(`>>selenium/liking - failed`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.status(response.code).json(response);
  } else {
    console.log(">>selenium/liking - fb login failed");

    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};

exports.sharing = async (req, res) => {
  console.log(">>selenium/sharing");

  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  const { status, driver } = seleniumResponse;

  if (status) {
    console.log(">>selenium/sharing - fb login success");

    const { urls } = req.body;

    var response = {
      code: 200,
      status: true,
      message: "Posts shared successfully",
    };

    try {
      for (const url of urls) {
        console.log(`Processing URL: ${url}`);
        await driver.get(url);

        const shareButton = driver.wait(
          until.elementLocated(
            By.css(
              'div[aria-label="Send this to friends or post it on your timeline."]'
            )
          )
        );

        if (shareButton) {
          shareButton.click();

          await driver.sleep(2000);

          try {
            const shareNow = await driver.wait(
              until.elementLocated(By.xpath("//*[text()='Share now (Public)']"))
            );

            if (shareNow) {
              shareNow.click();

              console.log(">>selenium/sharing - shared successfully");

              await driver.sleep(3000);
            }
          } catch (error) {
            console.log(`>>selenium/sharing - share now not found`);
            console.log(error.message);
          }
        }
      }
    } catch (error) {
      console.log(`>>selenium/sharing - failed`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.status(response.code).json(response);
  } else {
    console.log(">>selenium/sharing - fb login failed");

    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};
