import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import GraphViewer from './components/GraphViewer';

const App = () => {
  const [data, setData] = useState({});
  const [projectPath, setProjectPath] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [hideUnused, setHideUnused] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScan = async () => {
    if (!projectPath) {
      setErrorMessage('Please enter a valid folder path before scanning.');
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/scan?path=${encodeURIComponent(projectPath)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setSelectedFile(null);
    } catch (err) {
      setErrorMessage(
        'Scan failed. Please check the folder path and ensure the backend server is running.'
      );
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dependencies.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setData({});
    setProjectPath('');
    setSearchTerm('');
    setSelectedFile(null);
    setHideUnused(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderBottom: '2px solid #334155',
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            📂 File Dependency Analyzer
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#cbd5e1',
              maxWidth: '600px',
              lineHeight: '1.4',
            }}
          >
            Visualize, explore, and understand how files in your project are
            connected.
          </p>
        </div>

        <Toolbar
          projectPath={projectPath}
          setProjectPath={setProjectPath}
          onScan={handleScan}
          onExportJSON={handleExportJSON}
          onReset={handleReset}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div
          style={{
            width: 300,
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Sidebar
            data={data}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectFile={setSelectedFile}
            selectedFile={selectedFile}
            hideUnused={hideUnused}
            setHideUnused={setHideUnused}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: '#2563eb',
                    borderRadius: 2,
                  }}
                ></div>
                <span>Internal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: '#f59e0b',
                    borderRadius: 2,
                  }}
                ></div>
                <span>External</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: '#ef4444',
                    borderRadius: 2,
                  }}
                ></div>
                <span>Unused</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Help
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GraphViewer
              data={data}
              selectedFile={selectedFile}
              onNodeSelect={setSelectedFile}
              hideUnused={hideUnused}
            />
          </div>
        </div>
      </div>

      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: 8,
              width: '350px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Legend</h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li>
                <b style={{ color: '#2563eb' }}>Internal Node</b> – Represents a
                project file that is actively used, meaning it is imported by
                one or more other files within the project.
              </li>
              <li>
                <b style={{ color: '#f59e0b' }}>External Node</b> – Represents
                an external dependency, such as an npm package or third-party
                library, referenced in your project.
              </li>
              <li>
                <b style={{ color: '#ef4444' }}>Unused Node</b> – Represents a
                project file that may depend on other files but is not imported
                anywhere else in the project.
              </li>
            </ul>

            <button
              onClick={() => setShowHelp(false)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          onClick={() => setErrorMessage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: 8,
              width: '350px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ marginTop: 0, color: '#ef4444' }}>⚠️ Error</h2>
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer
        style={{
          textAlign: 'center',
          padding: '3px',
          background: '#1e293b',
          color: 'white',
          fontSize: '14px',
        }}
      >
        © 2025 Sumehar Singh Grewal
      </footer>
    </div>
  );
};

export default App;
