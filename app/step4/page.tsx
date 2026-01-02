'use client';

import React from 'react';
import PdfPage, { PdfInputField } from '@/components/PdfPage';
import { usePlaybook } from '@/context/PlaybookContext';
import AppShell from '@/components/app/AppShell';

export default function Step4Page() {
  const { step3, step4, updateStep3, updateStep4 } = usePlaybook();

  const handleIdeaTitleChange = (index: number, title: string) => {
    const next = [...step3.ideas];
    const current = next[index];
    if (!current) return;
    next[index] = { ...current, title };
    updateStep3(next);
  };

  const handleScoreChange = (index: number, score: number) => {
    const newEvaluations = [...step4.evaluations];
    newEvaluations[index] = { ...newEvaluations[index], score };
    updateStep4(newEvaluations);
  };

  const handleSolutionChange = (index: number, solves: 'yes' | 'no' | '') => {
    const newEvaluations = [...step4.evaluations];
    newEvaluations[index] = { ...newEvaluations[index], solvesProblem: solves };
    updateStep4(newEvaluations);
  };

  const getWinningIdeaName = () => {
    const byId = new Map(step3.ideas.map(i => [i.id, i] as const));
    const sorted = [...(step4.evaluations || [])].sort((a, b) => {
      const aSolves = a.solvesProblem === 'yes' ? 1 : 0;
      const bSolves = b.solvesProblem === 'yes' ? 1 : 0;
      if (bSolves !== aSolves) return bSolves - aSolves;
      return (b.score || 0) - (a.score || 0);
    });
    const winning = sorted[0];
    const idea = winning ? byId.get(winning.ideaId) : undefined;
    if (!idea) return '';
    const title = (idea.title || '').trim();
    if (title) return title;
    if (idea.mode === 'write') return (idea.content || '').trim();
    return `Idea ${idea.id}`;
  };

  return (
    <AppShell title="Step 4">
    <div className="space-y-10">
      <PdfPage pageNumber={9}>
        <PdfInputField
          rect={{ x: 540, y: 148, width: 200, height: 25 }}
          value={getWinningIdeaName()}
          onChangeAction={() => {}}
          align="center"
          fontSize={12}
          padding={0}
          className="font-semibold pointer-events-none"
        />

        {(() => {
          const rowYs = [237, 288, 338, 387, 437, 486];
          const scoreX = 385;
          const scoreW = 120;
          const solveX = 545;
          const solveW = 160;

          const ideaX = 292;
          const ideaW = 88;
          const inputH = 24;

          return rowYs.map((rowY, i) => {
            const evalRow = step4.evaluations[i];
            const y = rowY + 1;
            const idea = step3.ideas[i];
            const ideaTitle = (idea?.title ?? (idea?.mode === 'write' ? idea?.content : '')).trimEnd();
            return (
              <React.Fragment key={i}>
                <input
                  type="text"
                  value={ideaTitle}
                  onChange={(e) => handleIdeaTitleChange(i, e.target.value)}
                  placeholder=""
                  className="absolute bg-transparent text-sns-dark focus:outline-none"
                  style={{ left: ideaX, top: y, width: ideaW, height: inputH, fontSize: 11 }}
                />
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={evalRow?.score ?? 5}
                  onChange={(e) => handleScoreChange(i, parseInt(e.target.value) || 0)}
                  className="absolute bg-transparent text-sns-dark focus:outline-none"
                  style={{ left: scoreX, top: y, width: scoreW, height: inputH, fontSize: 12 }}
                />
                <select
                  value={evalRow?.solvesProblem ?? ''}
                  onChange={(e) => handleSolutionChange(i, e.target.value as 'yes' | 'no' | '')}
                  className="absolute bg-transparent text-sns-dark focus:outline-none"
                  style={{ left: solveX, top: y, width: solveW, height: inputH, fontSize: 12 }}
                >
                  <option value=""> </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </React.Fragment>
            );
          });
        })()}
      </PdfPage>
    </div>
    </AppShell>
  );
}
