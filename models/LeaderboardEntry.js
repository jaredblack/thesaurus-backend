const mongoose = require("mongoose");
const LeaderboardEntrySchema = new mongoose.Schema({
  startWord: String,
  endWord: String,
  users: Array,
});
LeaderboardEntrySchema.methods.addUser = function (name, score, cb) {
  this.users.push({ name: name, score: score });
  this.save(cb);
};
mongoose.model("LeaderboardEntry", LeaderboardEntrySchema);
