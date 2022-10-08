"use strict";
const { Router } = require("express");
const router = Router();
require("dotenv").config();
const needle = require("needle");
const bearerToken = process.env.BEARER_TOKEN;
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Slow down ma' boy!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// This function convert "user" -> Id
// e.g: mondongo -> 18474748383
const getUserID = async (username) => {
  const response = await needle(
    "get",
    `https://api.twitter.com/2/users/by/username/${username}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  if (response.statusCode == 400) {
    return await {
      id: "Error, user not found, or has protected tweets.",
      username: "Error, user not found, or has protected tweets.",
    };
  } else {
    return await {
      id: response.body.data.id,
      username: response.body.data.username,
    };
  }
};

router.get("/tweets", limiter, (req, res) => {
  const userArray = [
    req.query.user,
    req.query.user2,
    req.query.user3,
    req.query.user4,
  ];
  console.log(userArray);
  let brandom = Math.floor(Math.random() * userArray.length);
  const randomUser = userArray[brandom];
  // I need to handle the error better :sob:
  if (req.query.user == "" || req.query.user2 == "" || req.query.user3 == "") {
    res.json({
      error: "Empty username",
    });
    console.log("Error, empty username.");
  } else {
    console.log(`⏩${randomUser}⏪`);
    getUserID(randomUser).then(function (id) {
      const url = `https://api.twitter.com/2/users/${id.id}/tweets`;
      const getUserTweets = async () => {
        let userTweets = [];
        let params = {
          max_results: 100, // Number of tweets
        };
        const options = {
          headers: {
            "User-Agent": "lmao",
            authorization: `Bearer ${bearerToken}`,
          },
        };
        let hasNextPage = true;
        let nextToken = null;
        while (hasNextPage) {
          let resp = await getPage(params, options, nextToken);
          if (
            resp &&
            resp.meta &&
            resp.meta.result_count &&
            resp.meta.result_count > 0
          ) {
            userName = resp.includes.users[0].username;
            if (resp.data) {
              userTweets.push.apply(userTweets, resp.data);
            }
            if (resp.meta.next_token) {
              nextToken = resp.meta.next_token;
            } else {
              hasNextPage = false;
            }
          } else {
            hasNextPage = false;
          }
        }
      };
      const getPage = async (params, options, nextToken) => {
        if (nextToken) {
          params.pagination_token = nextToken;
        }
        try {
          const resp = await needle("get", url, params, options);
          if (resp.statusCode != 200) {
            console.log(
              `${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`
            );
            return;
          }
          let RandomTweet = resp.body.data;
          let r = Math.floor(Math.random() * RandomTweet.length);
          console.log(RandomTweet[r].text);

          return res.json({ tweet: RandomTweet[r].text, by: id.username }); // userID -> username
        } catch (err) {
          console.log(error);
          return res.json({ tweet: "error", by: "error" }); // userID -> username
        }
      };
      getUserTweets();
    });
  }
});

module.exports = router;
