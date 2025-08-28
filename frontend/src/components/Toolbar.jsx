import React from 'react';

const Toolbar = ({
  projectPath,
  setProjectPath,
  onScan,
  onExportJSON,
  onReset,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        backgroundColor: '#1e293b',
        color: '#fff',
        borderBottom: '2px solid #334155',
        gap: '12px',
      }}
    >
      <div
        style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}
      >
        <input
          type="text"
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
          placeholder="Paste local folder path (C:\\...)"
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            border: '1px solid #475569',
            backgroundColor: '#0f172a',
            color: '#fff',
            outline: 'none',
            fontSize: '14px',
            flex: 1,
          }}
        />
        <button
          onClick={onScan}
          style={{
            backgroundColor: '#3b82f6',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          Scan
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onExportJSON}
          style={{
            backgroundColor: '#22c55e',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          Export JSON
        </button>
        <button
          onClick={onReset}
          style={{
            backgroundColor: '#ef4444',
            border: 'none',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          ♻ Reset
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
