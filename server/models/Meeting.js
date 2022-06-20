const mongoose = require("mongoose");
const { Faculty } = require("./Faculty");
var axios = require("axios");
const { Committe } = require("./Committe");

const meetingSchema = mongoose.Schema({
  subject: {
    type: String,
    maxlength: 50,
  },
  date: Date,
  time: Number,
  meetingRoom: String,
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  committe: { type: mongoose.Schema.Types.ObjectId, ref: "Committe" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
  chatId: Number,
  chatAccessKey: String,
  report: { type: String, default: "" },
});
meetingSchema.pre("save", function (next) {
  // the user that is about to be saved
  let doc = this;
  Faculty.find(
    { _id: { $in: [...doc.members] } },
    "chatSecret email",
    (err, members) => {
      if (err) next(err);
      const data = {
        title: doc.subject,
        is_direct_chat: false,
        usernames: [...members.map((i) => i.email)],
      };
      const config = {
        method: "put",
        url: "https://api.chatengine.io/chats/",
        headers: {
          "Project-ID": "daedec64-83a9-4c95-b048-2fa8474789ea",
          "User-Name": members[0].email,
          "User-Secret": members[0].chatSecret,
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          doc.chatId = response.data.id;
          doc.chatAccessKey = response.data.access_key;
          Committe.findOneAndUpdate(
            { _id: this.committe },
            {
              $push: { meetings: this },
            }
          ).exec(() => {
            next();
          });
        })
        .catch(function (error) {
          console.error(error);
          next();
        });
    }
  );
});
meetingSchema.pre("remove", async function (next) {
  const doc = this;
  next();
});
const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = { Meeting };
