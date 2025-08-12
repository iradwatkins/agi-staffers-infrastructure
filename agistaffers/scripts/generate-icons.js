const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#667eea"/>
  <text x="256" y="256" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">A</text>
  <text x="256" y="350" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" dominant-baseline="middle" fill="white">STAFFERS</text>
</svg>`;

// Save SVG
fs.writeFileSync(path.join(__dirname, '../public/icons/icon.svg'), svgIcon);

// Create a proper favicon.ico content (1x1 transparent pixel for now)
const favicon = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00,
  0x20, 0x00, 0x68, 0x04, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00,
  0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x01, 0x00,
  0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00
]);

// Save favicon
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), favicon);

console.log('Icons generated successfully!');