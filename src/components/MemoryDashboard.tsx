import React, { useState } from 'react';
import { useMemory } from '../context/MemoryContext';
import { BrainCircuit, Clock, Trash2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

export const MemoryDashboard: React.FC = () => {
  const { memories, activityLogs, forgetMemory, updateMemoryScope, clearAllMemories } = useMemory();
  const [activeTab, setActiveTab] = useState<'current' | 'activity'>('current');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BrainCircuit className="text-primary-600" size={32} />
          Memory Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Review, edit, or clear what SathiAI remembers about you. You are in control.
        </p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('current')}
          className={clsx("pb-3 text-sm font-semibold transition-colors border-b-2", activeTab === 'current' ? "border-primary-600 text-primary-700" : "border-transparent text-slate-500 hover:text-slate-800")}
        >
          Current Memory ({memories.length})
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={clsx("pb-3 text-sm font-semibold transition-colors border-b-2", activeTab === 'activity' ? "border-primary-600 text-primary-700" : "border-transparent text-slate-500 hover:text-slate-800")}
        >
          Activity Log
        </button>
      </div>

      {activeTab === 'current' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {memories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <BrainCircuit className="mx-auto text-slate-300 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-slate-700">Nothing remembered yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">SathiAI hasn't saved any details about you. When it does, you'll see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map(memory => (
                <div key={memory.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{memory.category}</span>
                      <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1", memory.scope === 'long-term' ? 'bg-primary-100 text-primary-800' : 'bg-amber-100 text-amber-800')}>
                        {memory.scope === 'long-term' ? 'Long-term' : 'Session Only'}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 mt-2">{memory.fact}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock size={12} /> Learned from: {memory.sourceContext}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => updateMemoryScope(memory.id, memory.scope === 'long-term' ? 'session' : 'long-term')}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                    >
                      <ArrowRightLeft size={14} /> 
                      Change to {memory.scope === 'long-term' ? 'Session' : 'Long-term'}
                    </button>
                    <button 
                      onClick={() => forgetMemory(memory.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 size={14} /> Forget
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {memories.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete everything SathiAI remembers about you?')) {
                    clearAllMemories();
                  }
                }}
                className="flex items-center gap-2 text-red-600 font-semibold text-sm hover:text-red-800 bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                <ShieldAlert size={18} />
                Forget Everything
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activityLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No activity recorded yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activityLogs.map(log => (
                <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                  <div className="mt-1">
                    {log.action === 'Added' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    {log.action === 'Forgotten' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    {log.action === 'Scope Changed' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800">{log.description}</p>
                    <span className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
};
