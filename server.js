require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);
  console.log(`Backend running on port ${PORT}`);
});


