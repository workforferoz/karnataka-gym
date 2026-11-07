'use client';

import React, { useState } from 'react';
import { useGym } from '@/lib/store';
import {
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  X,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TestChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKLIST_ITEMS = [
  { id: 1, title: 'QR Duplicate Scan within 5 min rejects with "Duplicate"' },
  { id: 2, title: 'Scanning with expired membership blocks entry' },
  { id: 3, title: 'Approved pause (freeze) does NOT break attendance streak' },
  { id: 4, title: 'Offline sync queues attendance and pushes upon reconnection' },
  { id: 5, title: 'Assisted check-in prompts for mandatory reason and logs to AuditLogs' },
  { id: 6, title: 'Failed simulated payment does NOT extend membership date' },
  { id: 7, title: 'Duplicate webhook callback does not double-extend membership' },
  { id: 8, title: 'Refund updates Payments state and adjusts Memberships table accordingly' },
  { id: 9, title: 'Booking PT with an unavailable trainer throws a conflict error' },
  { id: 10, title: 'Buying an out-of-stock supplement fails with clear message' },
  { id: 11, title: 'Member marketing opt-out stops non-transactional promotional notifications' },
  { id: 12, title: 'Owner can edit member active diet plan and override trainer with AuditLog' }
];

export const TestChecklistDrawer: React.FC<TestChecklistDrawerProps> = ({ isOpen, onClose }) => {
  const { runAutomatedTest, testResults, resetAllDataToSeed } = useGym();
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeTestRunning, setActiveTestRunning] = useState<number | null>(null);

  if (!isOpen) return null;

  const passedCount = Object.values(testResults).filter((r) => r.passed).length;

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (let i = 1; i <= 12; i++) {
      setActiveTestRunning(i);
      await runAutomatedTest(i);
      // Small pause for realistic test runner visualization
      await new Promise((r) => setTimeout(r, 200));
    }
    setActiveTestRunning(null);
    setIsRunningAll(false);
  };

  const handleRunSingle = async (id: number) => {
    setActiveTestRunning(id);
    await runAutomatedTest(id);
    setActiveTestRunning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-[#0D111A] border-l border-[#242C3F] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#1F2739] flex items-center justify-between bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                Automated System Test Suite
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
                  {passedCount}/12 PASSED
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                12 Idempotency, Logic & State Guardrail Checks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1C2333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-3 bg-[#151B28] border-b border-[#232B3E] flex items-center justify-between gap-2">
          <button
            onClick={handleRunAll}
            disabled={isRunningAll}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-lg shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'Executing 12 System Tests...' : 'Run All 12 Automated Tests'}</span>
          </button>

          <button
            onClick={resetAllDataToSeed}
            className="flex items-center gap-1.5 bg-[#1F2739] hover:bg-[#28324A] text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl border border-[#354360] active:scale-95 transition-all cursor-pointer"
            title="Reset to fresh seed state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>

        {/* Test Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {CHECKLIST_ITEMS.map((item) => {
            const res = testResults[item.id];
            const isCurrentlyRunning = activeTestRunning === item.id;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  res?.passed
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : res && !res.passed
                    ? 'bg-red-950/20 border-red-800/60'
                    : 'bg-[#131722] border-[#222A3C]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[11px] font-mono font-bold text-slate-500 mt-0.5">
                      #{item.id}
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                      {res && (
                        <p
                          className={`text-[11px] mt-1.5 leading-snug font-mono p-1.5 rounded ${
                            res.passed
                              ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-900/50'
                              : 'text-red-300 bg-red-950/40 border border-red-900/50'
                          }`}
                        >
                          {res.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {res?.passed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        PASS
                      </span>
                    ) : res && !res.passed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        FAIL
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRunSingle(item.id)}
                        disabled={isCurrentlyRunning}
                        className="text-[10px] font-bold text-[#E5A93C] hover:text-white bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {isCurrentlyRunning ? 'Testing...' : 'Run Test'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1F2739] bg-[#111520] text-center text-[11px] text-slate-400">
          Karnataka Gym Hubballi • Strict Idempotency & Database Integrity
        </div>
      </div>
    </div>
  );
};

