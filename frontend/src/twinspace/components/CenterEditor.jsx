import React from 'react';
import Editor from '@monaco-editor/react';
import { FileCode2, X, AlertTriangle, Eye, ShieldAlert, Sparkles } from 'lucide-react';

export function CenterEditor({
  openTabs,
  activeTabPath,
  onSelectTab,
  onCloseTab,
  fileContent,
  onChangeContent,
  activeCollaborators,
  currentUser,
  _isDiffMode,
  _diffOriginal,
  _diffModified
}) {
  const currentFileName = activeTabPath ? activeTabPath.split('/').pop() : 'No file selected';

  // Check if another active developer is editing the open file
  const concurrentUser = activeCollaborators?.find(
    u => u.id !== currentUser?.id && u.activeFile === activeTabPath
  );

  const getLanguage = (path) => {
    if (!path) return 'typescript';
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.sql')) return 'sql';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.css')) return 'css';
    return 'typescript';
  };

  return (
    <main className="twinspace-center-editor" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#0d1117',
      overflow: 'hidden'
    }}>
      {/* Editor Tabs Header Bar */}
      <div style={{
        height: '36px',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto'
      }}>
        {openTabs.map(tab => {
          const isActive = tab === activeTabPath;
          const fileName = tab.split('/').pop();
          return (
            <div
              key={tab}
              onClick={() => onSelectTab(tab)}
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 12px',
                background: isActive ? '#0d1117' : '#161b22',
                borderRight: '1px solid #30363d',
                borderTop: isActive ? '2px solid #58a6ff' : '2px solid transparent',
                color: isActive ? '#f0f6fc' : '#8b949e',
                fontSize: '0.75rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <FileCode2 size={13} style={{ color: '#38bdf8' }} />
              <span>{fileName}</span>
              <span style={{ fontSize: '10px', color: '#eab308' }}>●</span>
              <button
                onClick={(e) => { e.stopPropagation(); onCloseTab(tab); }}
                style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '2px' }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Concurrent File Access Warning Banner */}
      {concurrentUser && (
        <div style={{
          background: '#272008',
          borderBottom: '1px solid #74510b',
          color: '#e3b341',
          padding: '6px 16px',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={14} />
            <span><strong>{concurrentUser.name} ({concurrentUser.role})</strong> is currently editing <code>{currentFileName}</code>. Branch-based editing prevents collisions.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: '#382806', border: '1px solid #74510b', color: '#f0f6fc', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>View Only</button>
            <button style={{ background: '#238636', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>Request Access</button>
          </div>
        </div>
      )}

      {/* Code Editor or Diff View */}
      <div style={{ flex: 1, position: 'relative' }}>
        {activeTabPath ? (
          <Editor
            height="100%"
            language={getLanguage(activeTabPath)}
            theme="vs-dark"
            value={fileContent || ''}
            onChange={(val) => onChangeContent(activeTabPath, val || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              lineNumbersMinChars: 3
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b949e', textAlign: 'center' }}>
            <Sparkles size={42} style={{ color: '#58a6ff', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#f0f6fc', marginBottom: '6px' }}>TwinSpace Collaborative Editor</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '400px' }}>Select a repository file from the explorer sidebar to open and analyze code changes in real time.</p>
          </div>
        )}
      </div>
    </main>
  );
}
