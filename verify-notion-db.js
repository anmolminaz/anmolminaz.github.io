#!/usr/bin/env node

/**
 * Script to verify Notion database IDs and API access
 * Usage: node verify-notion-db.js
 */

require("dotenv").config({ path: ".env.local" });

const token = process.env.NOTION_TOKEN;
const dbIds = {
  research: process.env.NOTION_RESEARCH_DB_ID,
  analysis: process.env.NOTION_ANALYSIS_DB_ID,
  blog: process.env.NOTION_BLOG_DB_ID,
  publications: process.env.NOTION_PUBLICATIONS_DB_ID,
  profile: process.env.NOTION_PROFILE_DB_ID,
};

function formatDatabaseId(id) {
  return id.replace(/-/g, "");
}

async function testDatabase(name, dbId) {
  if (!dbId) {
    console.log(`❌ ${name}: ID is missing`);
    return false;
  }

  const formattedId = formatDatabaseId(dbId);
  const url = `https://api.notion.com/v1/databases/${formattedId}/query`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name}: Success (${data.results.length} items)`);
      return true;
    } else {
      const errorData = await response.text();
      console.log(`❌ ${name}: ${response.status} ${response.statusText}`);
      console.log(`   Original ID: ${dbId}`);
      console.log(`   Formatted ID: ${formattedId}`);
      console.log(`   Error: ${errorData}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("\n🔍 Notion Database Verification\n");

  if (!token) {
    console.log("❌ NOTION_TOKEN not set in .env.local");
    process.exit(1);
  }

  console.log(
    `Token: ${token.substring(0, 10)}...${token.substring(token.length - 10)}\n`,
  );

  for (const [name, dbId] of Object.entries(dbIds)) {
    await testDatabase(name, dbId);
  }

  console.log("");
}

main();
