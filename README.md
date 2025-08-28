# 📂 File Dependency Analyzer

The **File Dependency Analyzer** is a full-stack desktop application built with **Electron, React, and Node.js**.  
It scans a local project directory and visualizes the dependencies between files in an **interactive graph**.  
This helps developers identify **unused files, hidden dependencies, and external libraries** in their projects.

---

## 🚀 Features
- 📊 **Interactive Graph Visualization** – Files shown as nodes and dependencies as edges.
- 🟢 **Node Classification**:
  - Internal Nodes → Active project files  
  - External Nodes → NPM packages or libraries  
  - Unused Nodes → Files not imported anywhere
- 🖥️ **Cross-Platform Desktop App** (Windows installer via Electron).
- 🔎 **Search & Navigation** – Quickly find files through a sidebar.
- 🎨 **User-Friendly Interface** with toolbar, legend popup, and error handling.
- 📤 **Export to JSON** – Save dependency graphs for later analysis.

---

## 🏗️ Tech Stack
- **Frontend:** React, Cytoscape.js, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Desktop Packaging:** Electron  
- **Data Structures:** Adjacency List, Maps, Sets  

---

## 📦 Installation

### 1️⃣ Clone the Repository
```powershell
git clone https://github.com/<your-username>/file-dependency-analyzer.git
cd file-dependency-analyzer
```
### 2️⃣ Install Dependencies
```powershell
For backend:
cd backend
npm install
```
```powershell
For frontend:
cd ../frontend
npm install
```

### 3️⃣ Run the Application
```powershell
For development:
npm run electron-dev
```

## 📥 Download Setup
[Download File Dependency Analyzer (Windows .exe)](https://github.com/Sumehar-Singh/File-Dependency-Analyzer/releases/download/v1.0.0/File.Dependency.Analyzer.Setup.1.0.0.exe)
