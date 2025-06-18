const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Marp header configuration
const marpHeader = `---
marp: true
theme: default
paginate: true
header: "Let Auth be Auth"
footer: "MCP Shop"
style: |
  section {
    font-size: 1em;
  }
  h1 {
    font-size: 2em;
  }
  img {
    max-height: 200px;
  }
---

`;

// Read the README
const readmePath = path.join(__dirname, 'README.md');
const content = fs.readFileSync(readmePath, 'utf8');

// Split content by sections (##)
const sections = content.split(/^##/m);

// Add the first section (title) without modification
let marpContent = marpHeader + sections[0];

// Process remaining sections
for (let i = 1; i < sections.length; i++) {
    // Add back the ## that was removed by split
    marpContent += '\n\n---\n\n##' + sections[i];
}

// Write to a temporary file
const tempPath = path.join(__dirname, 'temp-slides.md');
fs.writeFileSync(tempPath, marpContent);

// Compile with Marp
try {
    execSync(`marp ${tempPath} --html -o talk/slides.html`, { stdio: 'inherit' });
    console.log('Successfully generated slides!');
} catch (error) {
    console.error('Error generating slides:', error);
} finally {
    // Clean up temp file
    fs.unlinkSync(tempPath);
} 