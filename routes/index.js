var express = require("express");
var app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const LeaderboardEntries = require("../models/LeaderboardEntry");
const LeaderboardEntry = mongoose.model("LeaderboardEntry");

const wordList = [
  { word: "intelligent", antonym: "stupid" },
  { word: "difficult", antonym: "easy" },
  { word: "nice", antonym: "nasty" },
  { word: "well", antonym: "ill" },
  { word: "light", antonym: "heavy" },
  { word: "right", antonym: "wrong" },
  { word: "happy", antonym: "sad" },
  { word: "polite", antonym: "rude" },
  { word: "new", antonym: "old" },
  { word: "full", antonym: "empty" },
  { word: "true", antonym: "false" },
  { word: "big", antonym: "small" },
  { word: "hardworking", antonym: "lazy" },
  { word: "safe", antonym: "dangerous" },
  { word: "hot", antonym: "cold" },
  { word: "clean", antonym: "dirty" },
  { word: "beautiful", antonym: "ugly" },
  { word: "fat", antonym: "thin" },
  { word: "curly", antonym: "straight" },
  { word: "bitter", antonym: "sweet" },
  { word: "single", antonym: "married" },
  { word: "quiet", antonym: "noisy" },
  { word: "good", antonym: "bad" },
  { word: "alive", antonym: "dead" },
  { word: "modern", antonym: "traditional" },
  { word: "small", antonym: "big" },
  { word: "white", antonym: "black" },
  { word: "poor", antonym: "rich" },
  { word: "soft", antonym: "hard" },
  { word: "interesting", antonym: "boring" },
  { word: "short", antonym: "long" },
  { word: "early", antonym: "late" },
  { word: "cheap", antonym: "expensive" },
];

const dbURL = "mongodb://localhost/thesaurus-game";
mongoose.connect(dbURL);

app.use(express.json());
app.use(cors());

function addEntry(startWord, endWord, next) {
  entry = new LeaderboardEntry({
    startWord: startWord,
    endWord: endWord,
    users: [],
  });
  entry.save(function (err, comment) {
    if (err) {
      return next(err);
    }
  });
  return entry;
}

app.get("/api/getEntry/:startWord/:endWord", function (req, res, next) {
  LeaderboardEntry.find(
    { startWord: req.params.startWord, endWord: req.params.endWord },
    function (err, entry) {
      if (err || !entry || entry.length === 0) {
        entry = addEntry(req.params.startWord, req.params.endWord, next);
      } else {
        entry = entry[0];
      }
      res.json(entry);
    }
  );
});

app.get("/api/getDaily", function (req, res, next) {
  let currentTime = new Date();
  let days = Math.floor(currentTime / 8.64e7);
  let wordIndex = days % wordList.length;
  res.json(wordList[wordIndex]);
});

app.get("/api/getRandom", function (req, res, next) {
  let wordIndex = Math.floor(Math.random() * wordList.length);
  res.json(wordList[wordIndex]);
});

app.post("/api/addUserScore", function (req, res, next) {
  LeaderboardEntry.find(
    { startWord: req.body.startWord, endWord: req.body.endWord },
    function (err, foundEntry) {
      let entry;
      if (err || !foundEntry || foundEntry.length === 0) {
        console.log("Couldn't find a matching entry, creating a new one");
        entry = addEntry(req.body.startWord, req.body.endWord, next);
      } else {
        entry = foundEntry[0];
      }
      entry.addUser(
        req.body.username,
        req.body.score,
        function (err, returnedEntry) {
          if (err) {
            return next(err);
          }
          res.json(returnedEntry);
        }
      );
    }
  );
});

app.get("/api/allLeaderboards", function (req, res, next) {
  LeaderboardEntry.find(function (err, foundEntries) {
    if (err) {
      return next(err);
    }
    res.json(foundEntries);
  });
});

app.delete("/api/delete/:startWord/:endWord", function (req, res, next) {
  LeaderboardEntry.deleteOne(
    { startWord: req.params.startWord, endWord: req.params.endWord },
    function (err, dbRes) {
      if (err) {
        return next(err);
      } else {
        res.json('{"msg":"Successfully deleted entry"}');
      }
    }
  );
});

module.exports = app;
