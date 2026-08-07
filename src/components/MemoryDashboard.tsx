import React, { useState } from 'react';
import { useMemory, MemoryScope } from '../context/MemoryContext';
import { useLanguage } from '../context/LanguageContext';
import { Brain, Clock, Trash2, ArrowRightLeft, ShieldAlert, Check, Plus } from 'lucide-react';

export const MemoryDashboard: React.FC = () => {
  const { memories, activityLogs, forgetMemory, updateMemoryScope, clearAllMemories, addMemory } = useMemory();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'memories' | 'activity'>('memories');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newFact, setNewFact] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'About You' | 'Preferences' | 'Scheme Interests'>('About You');
  const [newScope, setNewScope] = useState<MemoryScope>('long-term');

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    addMemory({
      category: newCategory,
      fact: newFact.trim(),
      sourceContext: 'Manual Addition in Memory Dashboard',
      scope: newScope,
    });
    setNewFact('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#00366b] flex items-center gap-2.5">
            <Brain className="text-[#7C3AED]" size={32} />
            {t('memory.title')}
          </h1>
          <p className="text-sm text-[#424750] mt-1.5 leading-relaxed">
            {t('memory.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} /> Add Memory Fact
        </button>
      </div>

      {/* Manual Memory Addition Modal / Card */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-5 border-2 border-[#7C3AED]/40 shadow-md space-y-4 animate-in slide-in-from-top-3 duration-200">
          <h3 className="text-sm font-bold text-[#0F1B36] flex items-center gap-2">
            <Brain className="text-[#7C3AED]" size={18} />
            Add a Custom Fact to SarkarSaathi Memory
          </h3>
          <form onSubmit={handleAddMemorySubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#424750]">Fact / Context</label>
              <input
                type="text"
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                placeholder="e.g. Annual farm revenue is ₹1.8 Lakhs in Solapur"
                required
                className="w-full mt-1 px-3 py-2 border border-[#c3c6d1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#424750]">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 border border-[#c3c6d1] rounded-lg text-sm bg-white"
                >
                  <option value="About You">About You</option>
                  <option value="Preferences">Preferences</option>
                  <option value="Scheme Interests">Scheme Interests</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#424750]">Memory Scope</label>
                <select
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 border border-[#c3c6d1] rounded-lg text-sm bg-white"
                >
                  <option value="long-term">Long-term Scope (Persists)</option>
                  <option value="session">Session Only (Temporary)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#424750] hover:bg-[#eceef0] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg"
              >
                Save to Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#c3c6d1]">
        <button
          onClick={() => setActiveTab('memories')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'memories'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#424750] hover:text-[#0F1B36]'
          }`}
        >
          Remembered Facts ({memories.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#424750] hover:text-[#0F1B36]'
          }`}
        >
          {t('memory.activity')} ({activityLogs.length})
        </button>
      </div>

      {/* Memory Items List */}
      {activeTab === 'memories' && (
        <div className="space-y-4">
          {memories.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-[#c3c6d1]">
              <Brain className="mx-auto text-[#c3c6d1] mb-3" size={48} />
              <h3 className="font-bold text-[#0F1B36]">No memory facts saved yet</h3>
              <p className="text-xs text-[#424750] mt-1 max-w-sm mx-auto">
                SarkarSaathi will ask your permission before saving any detail about you.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-xl p-5 border border-[#c3c6d1] shadow-sm flex flex-col justify-between ${
                    m.scope === 'long-term' ? 'border-l-4 border-l-[#7C3AED]' : 'border-l-4 border-l-[#F59E0B]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f2f4f6] text-[#424750] px-2 py-0.5 rounded">
                        {m.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          m.scope === 'long-term'
                            ? 'bg-[#7C3AED]/15 text-[#7C3AED]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.scope === 'long-term' ? '🟣 Long-term' : '🟠 Session Only'}
                      </span>
                    </div>

                    <p className="font-semibold text-[#0F1B36] text-sm mt-2 leading-snug">
                      "{m.fact}"
                    </p>

                    <p className="text-xs text-[#424750] mt-2 flex items-center gap-1">
                      <Clock size={12} className="text-[#737781]" />
                      Learned via: {m.sourceContext}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#f2f4f6]">
                    <button
                      onClick={() => updateMemoryScope(m.id, m.scope === 'long-term' ? 'session' : 'long-term')}
                      className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
                    >
                      <ArrowRightLeft size={13} />
                      Switch to {m.scope === 'long-term' ? 'Session' : 'Long-term'}
                    </button>

                    <button
                      onClick={() => forgetMemory(m.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                      {t('memory.forget')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {memories.length > 0 && (
            <div className="pt-6 flex justify-end">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete everything SarkarSaathi remembers about you?')) {
                    clearAllMemories();
                  }
                }}
                className="text-xs font-bold text-red-700 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ShieldAlert size={16} />
                {t('memory.clearall')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity Log */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-[#c3c6d1] shadow-sm divide-y divide-[#f2f4f6]">
          {activityLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#424750]">No memory activity recorded.</div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3">
                <div className="mt-1">
                  {log.action === 'Added' && <Check size={16} className="text-emerald-600" />}
                  {log.action === 'Forgotten' && <Trash2 size={16} className="text-red-500" />}
                  {log.action === 'Scope Changed' && <ArrowRightLeft size={16} className="text-[#7C3AED]" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0F1B36]">{log.description}</p>
                  <span className="text-[10px] text-[#737781] mt-0.5 block">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
