import React, { useState } from 'react';
import { Plus, Edit3, Trash2, CheckCircle, Search, FileText } from 'lucide-react';

export const Admin03PassageCMS: React.FC = () => {
  const [passages, setPassages] = useState([
    { id: 'PSG-101', text: 'The quick brown fox jumps over the lazy dog while sports cars thunder down the asphalt highway.', chars: 99, difficulty: 'Normal', status: 'Published', timesPlayed: 4520 },
    { id: 'PSG-102', text: 'Precision and consistency build championship reflexes. Relax your wrists and keep your eyes focused ahead.', chars: 108, difficulty: 'Easy', status: 'Published', timesPlayed: 2890 },
    { id: 'PSG-103', text: 'Supercharged twin-turbochargers ignite high-octane fuel mixtures as checkered flags wave wildly across stadium arenas.', chars: 119, difficulty: 'Hard', status: 'Published', timesPlayed: 1420 },
    { id: 'PSG-104', text: 'Ergonomic mechanical switches actuate smoothly beneath eager fingertips racing for the podium line.', chars: 104, difficulty: 'Normal', status: 'Draft', timesPlayed: 0 },
  ]);

  const [newText, setNewText] = useState('');
  const [newDiff, setNewDiff] = useState('Normal');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddPassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newEntry = {
      id: `PSG-${Math.floor(100 + Math.random() * 900)}`,
      text: newText,
      chars: newText.length,
      difficulty: newDiff,
      status: 'Published',
      timesPlayed: 0
    };
    setPassages([newEntry, ...passages]);
    setNewText('');
    setShowAddModal(false);
  };

  return (
    <div className="admin-page-view">
      <div className="section-header-row mb-4">
        <div>
          <h2>Passage Management CMS (SRS FR-D03)</h2>
          <p className="text-secondary text-sm">Author, curate, version, and retire race text passages (180–300 English chars target).</p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>New Passage</span>
        </button>
      </div>

      <div className="card">
        <div className="races-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Content Text Snippet</th>
                <th>Characters</th>
                <th>Difficulty</th>
                <th>Times Raced</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passages.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td>
                    <span className="font-mono text-sm max-w-sm block truncate" title={p.text}>
                      {p.text}
                    </span>
                  </td>
                  <td>{p.chars} chars</td>
                  <td>
                    <span className={`badge ${p.difficulty === 'Easy' ? 'badge-green' : p.difficulty === 'Normal' ? 'badge-orange' : 'badge-purple'}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td>{p.timesPlayed.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.status === 'Published' ? 'badge-blue' : 'badge-secondary'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex-center gap-2">
                      <button className="btn btn-outline btn-sm">Retire</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
            <span className="badge badge-orange">Passage Authoring</span>
            <h2 className="mt-2">Add New Race Passage</h2>
            <form onSubmit={handleAddPassage} className="mt-4">
              <div className="input-group mb-3">
                <label className="input-label">Passage Content (English)</label>
                <textarea 
                  rows={4}
                  required 
                  className="input-field font-mono"
                  placeholder="Enter high quality text passage..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <span className="text-xs text-secondary">{newText.length} characters</span>
              </div>

              <div className="input-group mb-4">
                <label className="input-label">Target Difficulty</label>
                <select 
                  className="input-field"
                  value={newDiff}
                  onChange={(e) => setNewDiff(e.target.value)}
                >
                  <option value="Easy">Easy (Simple vocabulary, smooth rhythm)</option>
                  <option value="Normal">Normal (Everyday punctuation and words)</option>
                  <option value="Hard">Hard (Complex syllables, numbers, punctuation)</option>
                </select>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to Match Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
