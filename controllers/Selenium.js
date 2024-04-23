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
      skipped: [],
      status: true,
      message: "Members messaged successfully",
    };

    const { message, recipients, type } = req.body;

    try {
      // Loop through each recipient object in the recipients array
      for (const recipient of recipients) {
        // Replace all newline characters in the message with SHIFT+ENTER keystrokes and replace "@{nickname}" with the recipient's nickname or Facebook username
        var parsedMessage = message.replaceAll(
          "\n",
          Key.chord(Key.SHIFT, Key.ENTER)
        );

        if (type === "pm") {
          parsedMessage = parsedMessage.replaceAll(
            "@{nickname}",
            recipient.nickname || recipient.facebook
          );
        }

        // Construct the URL for the recipient's message thread and log it
        var url = "";
        if (type === "pm") {
          const messengerId = Date.parse(recipient.messengerId);

          if (isNaN(messengerId)) {
            url = `https://facebook.com/messages/t/${recipient.messengerId}`;
          }
        } else {
          url = `https://facebook.com/messages/t/${recipient.messengerId}`;
        }

        if (url) {
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
          } else {
            const duplicate = response.skipped.find(
              e => e === recipient.username
            );

            if (!duplicate) {
              response.skipped.push(recipient.username);
            }
          }
        } else {
          console.log(">>selenium/messaging - invalid url");
          response.skipped.push(recipient.username);
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

          await driver.sleep(3000);

          // Send the recipient's username preceded by "@" and ENTER keystrokes to tag them in the comment
          await messageInput.sendKeys(`@${username}`);
          await driver.sleep(3000);
          await messageInput.sendKeys(Key.ENTER);
          await driver.sleep(3000);
          await messageInput.sendKeys(" ");

          console.log(`>>selenium/tagging - ${username} success`);
        }

        // Send the message in the comment
        await messageInput.sendKeys(Key.ENTER);
      }
    } catch (error) {
      console.log(`>>selenium/tagging - failed`);
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

exports.taggingMultiple = async (req, res) => {
  console.log(">>selenium/tagging/multiple");

  // Call the seleniumLogin function to log in to a Facebook account
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  // Check the status of the response
  const { status, driver } = seleniumResponse;

  // If login was successful
  if (status) {
    console.log(">>selenium/tagging/multiple - fb login success");

    const { members, message, posts } = req.body;
  

    var response = {
      code: 200,
      status: true,
      message: "Members tagged successfully",
    };

    try {
      for (const index in posts) {
        const url = posts[index];
       
        // Navigate to the Facebook page or post where the tagging will take place
        console.log(`Processing URL: ${url}`);
        await driver.get(url.postId);

        // Wait for the comment input element to load and send the message along with a space to create a new comment
        const messageInput = await driver.wait(
          until.elementLocated(By.css('div[aria-label="Write a comment"]'))
        );

        if (messageInput) {
          await driver.sleep(3000);
          await messageInput.sendKeys(`${message} `);

          // Loop through the recipients array and tag each username in a separate comment
          for (const member of members) {
            const { username } = member;

            // Send the recipient's username preceded by "@" and ENTER keystrokes to tag them in the comment
            await messageInput.sendKeys(`@${username}`);
            await driver.sleep(3000);
            await messageInput.sendKeys(Key.ENTER);
            await driver.sleep(3000);
            await messageInput.sendKeys(" ");

            console.log(`>>selenium/tagging/multiple - ${username} success`);
          }

          // Send the message in the comment
          await messageInput.sendKeys(Key.ENTER);
        }
      }
    } catch (error) {
      console.log(`>>selenium/tagging/multiple - tagging failed`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      await driver.quit();
    }

    res.status(response.code).json(response);
  } else {
    console.log(">>selenium/tagging/multiple - fb login failed");

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
          var _url;

          if (ariaLabel === "Liked") {
            _url = `https://www.facebook.com/${url}`;
          } else {
            _url = url.postId;
          }

          console.log(`Processing URL: ${_url}`);
          await driver.get(_url);

          const removeLike = await driver.findElement(
            By.css(`div[aria-label="${ariaLabel}"]`)
          );

          if (removeLike) {
            console.log("Already liked");
            await driver.sleep(2000);
          }
        } catch (error) {
          // this error states that Remove like is not found, so it is available for liking
          // console.log(error.message);

          try {
            const like = await driver.findElement(
              By.css('div[aria-label="Like"]')
            );

            if (like) {
              await like.click();

              await driver.sleep(10000);

              console.log(`>>selenium/liking - ${_url} liked`);
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
        console.log(`Processing URL: ${url.postId}`);
        await driver.get(url.postId);

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

// Function for tagging one or more Facebook users in a post or comment
exports.posting = async (req, res) => {
  console.log(">>selenium/posting");

  // Call the seleniumLogin function to log in to a Facebook account
  const seleniumResponse = await seleniumLogin(
    res.locals.email,
    res.locals.password
  );

  // Check the status of the response
  const { status, driver } = seleniumResponse;

  // If login was successful
  if (status) {
    console.log(">>selenium/posting - fb login success");

    const { recipients, message } = req.body;

    var response = {
      code: 200,
      status: true,
      message: "Members tagged successfully",
    };

    try {
      // Loop through each recipient object in the recipients array
      for (const recipient of recipients) {
        // Replace all newline characters in the message with SHIFT+ENTER keystrokes and replace "@{nickname}" with the recipient's nickname or Facebook username
        var parsedMessage = message.replaceAll(
          "\n",
          Key.chord(Key.SHIFT, Key.ENTER)
        );

        try {
          // Construct the URL for the recipient's message thread and log it
          var url = recipient;
          console.log(`Processing URL: ${url}`);

          // Navigate to the recipient's message thread
          await driver.get(url);

          // Wait for the message input element to load and send the parsed message along with an ENTER keystroke to send the message
          const postInput = await driver.wait(
            until.elementLocated(
              By.xpath("//*[contains(text(),'Write something...')]")
            )
          );

          if (postInput) {
            postInput.click();

            try {
              const messageInput = await driver.wait(
                until.elementLocated(By.css('div[class="_1mf _1mj"]'))
              );

              if (messageInput) {
                await messageInput.sendKeys(parsedMessage);

                const postBtn = await driver.wait(
                  until.elementLocated(By.css('div[aria-label="Post"]'))
                );

                if (postBtn) {
                  postBtn.click();

                  console.log(`>>selenium/posting - ${url} success`);
                  await driver.sleep(5000);
                }
              }
            } catch (error) {
              console.log(">>selenium/posting - third error");
              console.log(error.message);
            }
          }
        } catch (error) {
          console.log(">>selenium/posting - second error");
          console.log(error.message);
        }
      }
    } catch (error) {
      console.log(`>>selenium/posting - ${url} error`);
      response.code = 400;
      response.status = false;
      response.message = error.message;
      console.log(error.message);
    } finally {
      // Quit the browser driver when finished
      await driver.quit();
    }

    res.status(response.code).json(response);
  } else {
    console.log(">>selenium/posting - fb login failed");

    res.status(400).json({
      status: false,
      message: seleniumResponse.message,
    });
  }
};
