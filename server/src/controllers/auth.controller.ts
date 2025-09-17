import { apiHandler, ok } from "../middlewares/errorHandling/index.js";

const signUp = apiHandler(async (req, res, next) => {
  

  return ok({
    res,
    message: "User created successfully",
  });
});

export { signUp };
