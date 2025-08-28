import React, { useMemo } from 'react';

const Sidebar = ({ data, searchTerm, onSearchChange, onSelectFile }) => {
  const files = Object.keys(data || {});

  const incomingCount = useMemo(() => {
    const map = {};
    Object.entries(data || {}).forEach(([file, importsRaw]) => {
      const imports = Array.isArray(importsRaw)
        ? importsRaw
        : importsRaw
        ? [importsRaw]
        : [];
      if (!map[file]) map[file] = 0;
      imports.forEach((dep) => {
        map[dep] = (map[dep] || 0) + 1;
      });
    });
    return map;
  }, [data]);

  const filteredFiles = files.filter((f) =>
    f.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const totalDependencies = Object.values(data || {}).reduce(
    (s, arr) => s + (Array.isArray(arr) ? arr.length : arr ? 1 : 0),
    0
  );

  return (
    <div
      className="sidebar"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        boxSizing: 'border-box',
        borderRight: '1px solid #ddd',
        backgroundColor: '#fafafa',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {files.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Files</div>
        </div>
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {totalDependencies}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Dependencies</div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search files..."
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '14px',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '8px',
          padding: '6px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {filteredFiles.map((f) => {
          const fileName = f.split('\\').pop();
          return (
            <div
              key={f}
              style={{
                padding: '8px 6px',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => onSelectFile(f)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#eef3ff')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                }}
                title={fileName}
              >
                {fileName}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2em',
                  maxHeight: '2.4em',
                  wordBreak: 'break-all',
                }}
                title={f}
              >
                {f}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
