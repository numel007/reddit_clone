const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    username: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  bcrype.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
