/** Server startup for BizTime. */


const app = require("./app");


app.listen(3000, "0.0.0.0", function () {
  console.log("Listening on 3000");
});