const e = require("cors");

const scraperObject = {
  url: "http://instagram.com",

  async scraper(browser, searchUsername) {
    let page = await browser.newPage();

    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url, { waitUntil: "networkidle0" });

    let inputUsername = await page.$('input[name="username"]');
    if (inputUsername !== null) {
      // Login to instagram
      await page.type('input[name="username"]', "Username4testing");

      await page.type('input[name="password"]', "passwordtesting");

      // await new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.all([
        page.click('[type="submit"]'),
        page.waitForNavigation({
          waitUntil: "networkidle0",
        }),
      ]);
    } else {
      // Else close this button

      let button = await page.$x(
        "/html/body/div[1]/div/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[3]/button[2]"
      );
      let buttonClick = await button[0].click;
    }

    // testing
    console.log(`radimo scrape za  ${searchUsername}`);

    await page.goto(`https://instagram.com/${searchUsername}`, {
      waitUntil: "networkidle0",
    });
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fetch user isPrivate
    let priv = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/div/article/div[1]/div/h2"
    );
    let userPrivate;
    if (typeof priv[0] !== "undefined") {
      userPrivate = true;
    } else {
      userPrivate = false;
    }

    // Fetch username

    let h2 = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[1]/h2"
    );
    if (typeof h2[0] === "undefined") {
      h2 = await page.$x(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[1]/h1"
      );
    }

    let val = await h2[0].getProperty("textContent");
    const userUsername = await val.jsonValue();

    // Fetch posts count
    let posts = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[1]/div/span"
    );
    let postsVal = await posts[0].getProperty("textContent");
    const userPostsCount = await postsVal.jsonValue();

    // Fetch followers count
    let followers = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[2]/div/span"
    );
    if (typeof followers[0] === "undefined") {
      followers = await page.$x(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[2]/a/div/span"
      );
    }

    let followersValue = await followers[0].getProperty("textContent");
    const userFollowersCount = await followersValue.jsonValue();

    // Fetch following count
    let following = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[3]/div/span"
    );
    if (typeof following[0] === "undefined") {
      following = await page.$x(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[3]/a/div/span"
      );
    }
    let followingValue = await following[0].getProperty("textContent");
    const userFollowingCount = await followingValue.jsonValue();

    // Fetch user name
    let name = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[3]/span"
    );
    let nameValue = await name[0].getProperty("textContent");
    const userName = await nameValue.jsonValue();

    // Fetch user is verified
    let verified = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[1]/div[1]/span"
    );
    let userVerified;
    if (typeof verified[0] !== "undefined") {
      userVerified = true;
    } else {
      userVerified = false;
    }

    // Fetch user bio
    let bio = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/section/div[3]/div"
    );

    let userBio;
    if (typeof bio[0] !== "undefined") {
      let bioValue = await bio[0].getProperty("textContent");
      userBio = await bioValue.jsonValue();
    } else {
      userBio = "empty";
    }

    // Fetch user img
    let img = await page.$x(
      "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/div/div/div/button/img"
    );

    if (typeof img[0] === "undefined") {
      img = await page.$x(
        "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/section/main/div/header/div/div/span/img"
      );
    }
    let imgValue = await img[0].getProperty("src");
    const userImg = await imgValue.jsonValue();

    await page.close();

    const fetchedUser = {
      username: userUsername,
      name: userName,
      biography: userBio,
      following_count: userFollowersCount,
      follows_count: userFollowingCount,
      posts_count: userPostsCount,
      image_url: userImg,
      is_verified: userVerified,
      is_private: userPrivate,
    };

    return fetchedUser;
  },
};

module.exports = scraperObject;
