const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const { createPost } = require("../controllers/feed.js");
const User = require("../models/user.js");

describe("Auth Controller - Login", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/test-shop");
    const user = new User({
      posts: [],
      _id: "6289facee3bd1e49c6338892",
      email: "test@test.com",
      password: "123",
      name: "test",
    });
    await user.save();
  });

  it("should create a post and associate it to the user", async () => {
    const req = {
        userId: "6289facee3bd1e49c6338892",
        file: {
            path: "/test/test.jpg"
        },
        body: {
            title: "Title",
            content: "content"
        }
      };
      const res = {
        status: function (code) {
          return this;
        },
        json: function () {}
      };
      const result = await createPost(req, res, () => {});
      expect(result).to.have.property("posts");
      expect(result.posts).to.have.length(1);
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
