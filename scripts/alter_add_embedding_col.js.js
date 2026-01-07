/**
 * STEP 3.2 — ALTER website_knowledge table
 * Add embedding column (vector stored as JSON for now)
 *
 * Safe to run multiple times
 */

require("dotenv").config();
const db = require("../config/db");

async function alterTable() {
  try {
    console.log("🔧 Checking / adding embedding column...");

    // Check if column already exists
    const [columns] = await db.query(`
      SHOW COLUMNS FROM website_knowledge LIKE 'embedding'
    `);

    if (columns.length > 0) {
      console.log("✅ embedding column already exists. Skipping ALTER.");
      process.exit(0);
    }

    // Add embedding column
    await db.query(`
      ALTER TABLE website_knowledge
      ADD COLUMN embedding JSON NULL
      AFTER clean_content
    `);

    console.log("✅ embedding column added successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ ALTER failed:", err.message);
    process.exit(1);
  }
}

alterTable();
