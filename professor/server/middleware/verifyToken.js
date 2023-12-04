import jwt from "jsonwebtoken";
const { verify, TokenExpiredError, JsonWebTokenError } = jwt;

const verifyToken = async (req, res, next) => {
  const { admin_token } = req.cookies;

  if (!admin_token) {
    return res.status(401).send({ message: "ADMIN IS NOT AUTHENTICATED" });
  }
  try {
    const decodedData = verify(admin_token, "jwtkey");

    req.professor = decodedData;

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    //  error :TokenExpiredError

    if (error instanceof TokenExpiredError) {
      const message = "Json Web Token is Expired, Try again";
      return res.status(error.statusCode).send({
        success: false,
        message: message,
      });
      // Error:  Wrong JWT error
    } else if (error instanceof JsonWebTokenError) {
      const message = "Json Web Token is invalid, Try again";
      return res.status(error.statusCode).send({
        success: false,
        message: message,
      });
    } else {
      return res.send(error);
    }
  }
};

const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "user is not authorized ",
      });
    }

    next();
  };
};
export { verifyToken, authorizedRoles };
