#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

function fixExtensionsInDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directory ${dir} does not exist`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixExtensionsInDirectory(fullPath);
    } else if (file.endsWith('.tsx')) {
      // Rename .tsx to .js
      const newPath = fullPath.replace(/\.tsx$/, '.js');
      fs.renameSync(fullPath, newPath);
      console.log(`✅ Renamed: ${file} -> ${file.replace(/\.tsx$/, '.js')}`);
    }
  });
}

function fixHTMLReferences(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixHTMLReferences(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Replace all .tsx references with .js in script tags and imports
      content = content.replace(/\.tsx(?=["'\s>)])/g, '.js');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Updated HTML references in: ${file}`);
      }
    }
  });
}

console.log('🔧 Fixing SteppersLife build output extensions...\n');

// Step 1: Rename all .tsx files to .js
console.log('Step 1: Renaming .tsx files to .js...');
fixExtensionsInDirectory(distPath);

// Step 2: Update all references in HTML files
console.log('\nStep 2: Updating HTML references...');
fixHTMLReferences(distPath);

console.log('\n✅ Build extensions fixed successfully!');
console.log('🚀 Your site should now load properly in browsers.');