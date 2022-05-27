const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/is-auth.js");

describe("Auth Middleware", () => {
  it("should raise an error when not authenticated", () => {
    const req = {
      get: () => null,
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should raise an error if the token is not split in two parts", () => {
    const req = {
      get: () => "xyz",
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error when the token is not verified", () => {
    const req = {
      get: () => "Bearer xyz",
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should add a userId property on success", () => {
    const req = {
      get: () => "Bearer xyz",
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId", "abc");
    jwt.verify.restore();
  });
});
