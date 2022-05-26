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
