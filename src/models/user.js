import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    membershipStatus: {
      type: String,
      required: true,
      enum: ["read", "write", "admin"],
      default: "read"
    }
  },
  { timestamps: true }
);

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login
  });

  return user;
};

userSchema.pre("remove", function (next) {
  this.model("Message").deleteMany({ user: this._id }, next);
});

const User = mongoose.model("User", userSchema);

export default User;
