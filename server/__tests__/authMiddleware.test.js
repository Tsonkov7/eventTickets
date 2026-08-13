import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { protect } from "../middlewares/authMiddleware.js";

jest.unstable_mockModule("../db/models/user.model.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

const User = (await import("../db/models/user.model.js")).default;

describe("protect middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    jest.clearAllMocks();
  });

  it("returns 401 when no token is provided", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when token is valid", async () => {
    const token = jwt.sign({ user: { id: "user123" } }, "test-secret");
    const mockUser = { _id: "user123", username: "testuser", email: "test@test.com" };
    User.findById.mockResolvedValue(mockUser);

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
  });
});
