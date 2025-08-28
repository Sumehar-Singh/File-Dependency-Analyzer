const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

const skipDirs = ['node_modules', '.git', 'dist', 'build'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);

    if (skipDirs.includes(file.toLowerCase())) {
      continue;
    }

    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch (err) {
      console.warn(`Skipping: ${fullPath} (${err.message})`);
      continue;
    }

    if (stats.isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
  const requireRegex = /require\(['"](.*?)['"]\)/g;

  let match;
  const imports = [];

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

app.get('/scan', (req, res) => {
  let folderPath = req.query.path;

  if (!folderPath) {
    return res.status(400).json({ error: 'Path is required' });
  }

  folderPath = decodeURIComponent(folderPath);

  try {
    const files = getAllFiles(folderPath);
    const dependencyMap = {};

    files.forEach((file) => {
      let imports = extractImports(file).map((dep) => {
        if (dep.startsWith('.')) {
          return path.resolve(path.dirname(file), dep);
        }
        return dep;
      });

      if (!Array.isArray(imports)) {
        imports = imports ? [imports] : [];
      }

      dependencyMap[file] = imports;
    });

    res.json(dependencyMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
