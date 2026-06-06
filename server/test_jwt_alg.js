const jwt = require("jsonwebtoken");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucnNsd2x3dGRmemZucGZleG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzcyNjYsImV4cCI6MjA5NjA1MzI2Nn0.wBd6cO_M8Nbh7KS8ZBq1l6r0s2aPNprzVedlfzXHJdU";
const secret = "SachinSlayHealthFounder";
try {
  const decoded = jwt.verify(token, secret);
  console.log("Decoded:", decoded);
} catch (e) {
  console.error("Failed:", e.message);
}
