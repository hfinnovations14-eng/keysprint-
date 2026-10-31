import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle, Search, FileText, RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const Admin03PassageCMS: React.FC = () => {
  const [passages, setPassages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newText, setNewText] = useState('');
  const [newDiff, setNewDiff] = useState('normal');
  const [newCategory, setNewCategory] = useState('motorsport');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPassages = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminPassages();
      if (res.passages) {
        setPassages(res.passages);
      }
    } catch (err) {
      console.error('Failed to load admin passages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassages();
  }, []);

  const handleAddPassage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.createAdminPassage({
        text: newText.trim(),
        difficulty: newDiff.toLowerCase(),
        category: newCategory.toLowerCase()
      });
      if (res.passage) {
        setPassages(prev => [res.passage, ...prev]);
        setNewText('');
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Failed to create passage:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetire = async (passageId: string) => {
    try {
      await api.retireAdminPassage(passageId);
      setPassages(prev => prev.map(p => p.id === passageId ? { ...p, status: 'retired' } : p));
    } catch (err) {
      console.error('Failed to retire passage:', err);
    }
  };

  return (
    <div className="admin-page-view">
      <div className="section-header-row mb-4">
        <div>
          <h2>Passage Management CMS (SRS FR-D03)</h2>
          <p className="text-secondary text-sm">Author, curate, version, and retire race text passages (180–300 English chars target).</p>
        </div>

        <div className="flex-center gap-2">
          <button className="btn btn-outline btn-sm flex-center gap-1" onClick={fetchPassages}>
            <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>New Passage</span>
          </button>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="text-center py-5">
            <Loader2 size={36} className="animate-spin text-orange mx-auto mb-2" />
            <p className="text-secondary">Loading curated passages from database...</p>
          </div>
        ) : (
          <div className="races-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Passage UUID</th>
                  <th>Content Text Snippet</th>
                  <th>Characters</th>
                  <th>Difficulty</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passages.map((p) => (
                  <tr key={p.id}>
                    <td><code>{p.id.slice(0, 8)}</code></td>
                    <td>
                      <span className="font-mono text-sm max-w-sm block truncate" title={p.text}>
                        {p.text}
                      </span>
                    </td>
                    <td>{p.text?.length || 0} chars</td>
                    <td>
                      <span className={`badge ${p.difficulty === 'easy' ? 'badge-green' : p.difficulty === 'normal' ? 'badge-orange' : 'badge-purple'}`}>
                        {p.difficulty.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{p.category || 'general'}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-secondary'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex-center gap-2">
                        {p.status === 'active' ? (
                          <button 
                            className="btn btn-outline btn-sm text-red"
                            onClick={() => handleRetire(p.id)}
                          >
                            Retire
                          </button>
                        ) : (
                          <span className="text-secondary text-xs">Retired</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  placeholder="Enter high-speed automotive or typing challenge text..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <span className="text-xs text-secondary">{newText.length} characters</span>
              </div>

              <div className="admin-split-grid mb-4">
                <div className="input-group">
                  <label className="input-label">Target Difficulty</label>
                  <select 
                    className="input-field"
                    value={newDiff}
                    onChange={(e) => setNewDiff(e.target.value)}
                  >
                    <option value="easy">Easy (Simple vocabulary, smooth rhythm)</option>
                    <option value="normal">Normal (Everyday punctuation and words)</option>
                    <option value="hard">Hard (Complex syllables, numbers, punctuation)</option>
                    <option value="expert">Expert (Fast contractions, special characters)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select 
                    className="input-field"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="motorsport">Motorsport</option>
                    <option value="general">General</option>
                    <option value="science">Science</option>
                    <option value="literature">Literature</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish to Live Match Pool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
