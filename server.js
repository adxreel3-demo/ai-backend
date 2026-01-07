require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT is not defined");
}
app.listen(PORT, "0.0.0.0", () => {
  console.log("OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);
  console.log(`Backend running on port ${PORT}`);
});



