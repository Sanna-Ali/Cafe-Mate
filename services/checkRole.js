require("dotenv").config();
function checkRole(req, res, next) {
  console.log("locals", res.locals);
  console.log("lo.row", res.locals.role);
  if (res.locals.role == process.env.USER) {
    res.sendStatus(401);
    console.log("locals", res.locals);
    console.log("lo.row", res.locals.role);
  } else next();
}
module.exports = { checkRole };
