const db = require("../../config/db");
const { hashContent } = require("../../utils/hashContent");

async function saveWebsiteChunk({
  company_id,
  source_url,
  page_type = "OTHER",
  raw_content,
  clean_content
}) {
  const content_hash = hashContent(clean_content);

  // 🔍 Check existing record
  const [rows] = await db.query(
    `SELECT id, content_hash FROM website_knowledge
     WHERE company_id = ? AND source_url = ? AND is_active = 1
     LIMIT 1`,
    [company_id, source_url]
  );

  // ✅ Same content → skip
  if (rows.length && rows[0].content_hash === content_hash) {
    return { status: "SKIPPED", reason: "NO_CHANGE" };
  }

  // 🔁 Content changed → update
  if (rows.length) {
    await db.query(
      `UPDATE website_knowledge
       SET raw_content = ?, clean_content = ?, content_hash = ?, updated_at = NOW()
       WHERE id = ?`,
      [raw_content, clean_content, content_hash, rows[0].id]
    );

    return { status: "UPDATED" };
  }

  // 🆕 New page → insert
  await db.query(
    `INSERT INTO website_knowledge
     (company_id, source_url, page_type, raw_content, clean_content, content_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      company_id,
      source_url,
      page_type,
      raw_content,
      clean_content,
      content_hash
    ]
  );

  return { status: "INSERTED" };
}

module.exports = { saveWebsiteChunk };
