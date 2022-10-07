"use strict";
const { Router } = require("express");
const router = Router();
require("dotenv").config();
const needle = require("needle");
const bearerToken = process.env.BEARER_TOKEN;

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
  return await response.body.data.id;
};

router.get("/tweets", (req, res) => {
  const userArray = [req.query.user, req.query.user2, req.query.user3];
  console.log(userArray);
  let brandom = Math.floor(Math.random() * userArray.length);
  const randomUser = userArray[brandom];
  // I need to handle the error better :sob:
  if (req.query.user == "" || req.query.user2 == "" || req.query.user3 == "") {
    res.json({
      error: "Empty username",
    });
  } else {
    console.log(`Random user ${randomUser}`);
    getUserID(randomUser).then(function (id) {
      console.log(id);
      const url = `https://api.twitter.com/2/users/${id}/tweets`;
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
        console.dir(userTweets, {
          depth: null,
        });
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
          // If the tweet doesen't begin with "RT"
          // if (!RandomTweet[r].text.startsWith("RT")) {
          console.log(RandomTweet[r].text);
          return res.json({ tweet: RandomTweet[r] });
          //}
        } catch (err) {
          throw new Error(`Request failed: ${err}`);
        }
      };
      getUserTweets();
    });
  }
});

module.exports = router;
