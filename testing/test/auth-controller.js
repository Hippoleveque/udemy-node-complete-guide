const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const { login, getUserStatus } = require("../controllers/auth.js");
const User = require("../models/user.js");

describe("Auth Controller - Login", () => {
  it("should throw error 500 if the database cannot be reached", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "123",
      },
    };
    login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });

  it("should get the correct status code", async () => {
    await mongoose.connect("mongodb://localhost:27017/test-shop");
    const user = new User({
      posts: [],
      _id: "6289facee3bd1e49c6338892",
      email: "test@test.com",
      password: "123",
      name: "test",
    });
    await user.save();
    const req = {
      userId: "6289facee3bd1e49c6338892",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (obj) {
        console.log("json called");
        this.userStatus = obj.status;
      },
    };
    const result = await getUserStatus(req, res, () => {});
    expect(res).to.have.property("statusCode", 200);
    expect(res).to.have.property("userStatus", "I am new!");
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
