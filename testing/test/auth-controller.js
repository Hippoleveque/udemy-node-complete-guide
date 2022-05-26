const expect = require("chai").expect;
const sinon = require("sinon");

const { login } = require("../controllers/auth.js");
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
});
