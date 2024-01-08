import mongoose from "mongoose";
import moment from "moment";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

messageSchema.virtual("when").get(function () {
  const whenStamp = moment(this.updatedAt || this.createdAt);
  return whenStamp.fromNow();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
