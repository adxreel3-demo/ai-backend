require("dotenv").config();
const db = require("../config/db");

async function alterTable() {
  try {
    console.log("⏳ Altering website_knowledge table...");

    await db.query(`
      ALTER TABLE website_knowledge
      ADD COLUMN chunk_index INT NULL AFTER clean_content,
      ADD COLUMN chunk_text LONGTEXT NULL AFTER chunk_index,
      ADD COLUMN chunk_hash CHAR(64) NULL AFTER chunk_text
    `);

    console.log("✅ website_knowledge updated with chunk columns");
    process.exit(0);
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("⚠️ Columns already exist, skipping");
      process.exit(0);
    }
    console.error(err);
    process.exit(1);
  }
}

alterTable();
