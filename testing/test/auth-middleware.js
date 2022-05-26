const expect = require("chai").expect;

const authMiddleware = require("../middleware/is-auth.js");

it("should raise an error when not authenticated", () => {
  const req = {
    get: () => null,
  };
  expect(authMiddleware.bind(this, req, null, () => {})).to.throw(
    "Not authenticated."
  );
});

it("should raise an error if the token is not split in two parts", () => {
  const req = {
    get: () => "xyz",
  };
  expect(authMiddleware.bind(this, req, null, null)).to.throw();
});
