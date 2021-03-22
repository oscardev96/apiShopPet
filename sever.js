const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3002;
const sever = http.createServer(app);
sever.listen(port);
