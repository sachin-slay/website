const jwt = require("jsonwebtoken");
const token = process.argv[2];
const secret = "SachinSlayHealthFounder";
try {
  const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
  console.log("Decoded:", decoded);
} catch (e) {
  console.error("Failed:", e.message);
}
