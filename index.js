const app = require("express")();
const PORT = 8080;
const mongoose = require("mongoose");
const User = require("./user");
const bodyParser = require("body-parser");
const cors = require("cors");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const browserObject = require("./browser");
const scraperController = require("./pageController");

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
// let page = await browserInstance.newPage();

// scraperController.assignPage(browserInstance);
// scraperController.assignPage(page, browserInstance).then(() => {
//   console.log(`page is defined now? ${page}`);
//   scraperController.login(page);
// });

// Pass the browser instance to the scraper controller

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Exchangeagram API",
      description: "All required Exchangeagram API information",
      contact: {
        name: "Petar Jovanovic",
      },
      servers: ["http://localhost:8080"],
    },
  },
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbURI =
  "mongodb+srv://root:Zf9t4KHiO8HiKRpP@exchangeagram.6dwcz.mongodb.net/ig-clone?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening at this port http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

// User model representation.
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - biography
 *         - following_count
 *         - follows_count
 *         - posts_count
 *         - image_url
 *         - is_verified
 *         - is_private
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         username:
 *           type: string
 *           description: The username of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         biography:
 *           type: string
 *           description: User's biography.
 *         following_count:
 *           type: string
 *           description: Number of users the specific user is following.
 *         follows_count:
 *           type: string
 *           description: Number of users following the specific user.
 *         posts_count:
 *           type: string
 *           description: Number of posts.
 *         image_url:
 *           type: string
 *           description: Url of the profile picture.
 *         is_verified:
 *           type: boolean
 *           description: If the user is verified.
 *         is_private:
 *           type: boolean
 *           description: If the user's profile is private.
 *       example:
 *         username: petarj77
 *         name: Petar Jovanovic
 *         biography: No bio.
 *         following_count: 187
 *         follows_count: 165
 *         posts_count: 11
 *         image_url: /
 *         is_verified: false
 *         is_private: true
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

// ---------------- Routes ---------------------

// Basic endpoint to add dummy data. Used as part of the testing process.
/**
 * @swagger
 * /add-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
app.post("/add-user", (req, res) => {
  console.log(req.body.username);
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    biography: req.body.biography,
    following_count: req.body.following_count,
    follows_count: req.body.follows_count,
    is_private: req.body.is_private,
    is_verified: req.body.is_verified,
    posts_count: req.body.posts_count,
    image_url: req.body.image_url,
  });

  // Persist the user to the database.
  user
    .save()
    .then((result) => res.send(result))
    .catch((error) => console.log(error));
});

// Endpoint to fetch all stored users.
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/users", (req, res) => {
  // Return all users
  User.find()
    .then((result) => res.send(result))
    .catch((error) => console.log(error));
});

// App flow should be the following.
// 1. Flutter frontend sends a GET request to this endpoint looking for a user
// 2. If the user was already searched and is stored in database, perform a simple database query to retrieve data.
//    Else: Perform scraper script to retrieve user data from instagram, store the user and then return the user data.

// Endpoint to search for a user by the username
/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get the user by it's username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user you are looking for.
 *     responses:
 *       200:
 *         description: The user's data that has the username.
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.get("/users/:user", (req, res) => {
  // Fetch the user from the database

  let userSentback;
  // scraperController(browserInstance, req.params.user);

  // SAMO OVO JE BILO U FUNKC
  // User.find({ username: req.params.user })
  //   .then((result) => res.send(result))
  //   .catch((error) => console.log(error));

  User.find({ username: req.params.user })
    .then(async (result) => {
      userSentback = result;
      if (userSentback.length === 0) {
        // Pass the browser instance to the scraper controller
        // and store the fetched data
        const fetchedUser = await scraperController(
          browserInstance,
          req.params.user
        );

        userSentback = new User({
          username: fetchedUser.username,
          name: fetchedUser.name,
          biography: fetchedUser.biography,
          following_count: fetchedUser.following_count,
          follows_count: fetchedUser.follows_count,
          is_private: fetchedUser.is_private,
          is_verified: fetchedUser.is_verified,
          posts_count: fetchedUser.posts_count,
          image_url: fetchedUser.image_url,
        });

        userSentback.save().then((result) => res.send(result));
      } else {
        res.send(userSentback);
      }
    })
    .catch((error) => console.log(error));
});
