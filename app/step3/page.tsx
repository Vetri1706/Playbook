'use client';

import React from 'react';
import PdfPage, { PdfBox, PdfInputField, PdfTextAreaField } from '@/components/PdfPage';
import CanvasDrawing from '@/components/CanvasDrawing';
import { usePlaybook } from '@/context/PlaybookContext';
import AppShell from '@/components/app/AppShell';
import TemplatePager from '@/components/app/TemplatePager';

export default function Step3Page() {
  const { step3, updateStep3, updateStep3Data } = usePlaybook();

  const updateIdea = (index: number, patch: { mode?: 'draw' | 'write'; content?: string }) => {
    const next = [...step3.ideas];
    next[index] = { ...next[index], ...patch };
    updateStep3(next);
  };

  const updateIdeaTitle = (index: number, title: string) => {
    const next = [...step3.ideas];
    next[index] = { ...next[index], title };
    updateStep3(next);
  };

  return (
    <AppShell title="Step 3">
      <TemplatePager
        title="Ideate"
        routePrev="/step2"
        routeNext="/step4"
        pages={[
          {
            key: 'p7',
            label: 'Product statement',
            content: (
              <PdfPage pageNumber={7}>
                {(() => {
                  const lines = (step3.productStatement || '').split('\n');
                  const getLine = (i: number) => (lines[i] ?? '').trimEnd();
                  const setLine = (i: number, nextValue: string) => {
                    const next = [...lines];
                    while (next.length < 3) next.push('');
                    next[i] = nextValue;
                    updateStep3Data({ productStatement: next.slice(0, 3).join('\n') });
                  };

                  const barX = 225;
                  const barW = 430;
                  const barH = 46;
                  const barYs = [210, 280, 350];

                  return (
                    <>
                      <PdfInputField
                        rect={{ x: barX, y: barYs[0], width: barW, height: barH }}
                        value={getLine(0)}
                        onChangeAction={(v) => setLine(0, v)}
                        fontSize={14}
                        padding={10}
                      />
                      <PdfInputField
                        rect={{ x: barX, y: barYs[1], width: barW, height: barH }}
                        value={getLine(1)}
                        onChangeAction={(v) => setLine(1, v)}
                        fontSize={14}
                        padding={10}
                      />
                      <PdfInputField
                        rect={{ x: barX, y: barYs[2], width: barW, height: barH }}
                        value={getLine(2)}
                        onChangeAction={(v) => setLine(2, v)}
                        fontSize={14}
                        padding={10}
                      />
                    </>
                  );
                })()}
              </PdfPage>
            ),
          },
          {
            key: 'p8',
            label: 'Crazy 6',
            content: (
              <PdfPage pageNumber={8}>
                {(
                  (() => {
                    const X_OFF = -30;
                    return (
                  [
                    {
                      id: 1,
                      draw: { x: 260 + X_OFF, y: 225, width: 130, height: 110 },
                      title: { x: 260 + X_OFF, y: 340, width: 130, height: 18 },
                      titleFontSize: 9,
                    },
                    {
                      id: 2,
                      draw: { x: 413 + X_OFF, y: 225, width: 130, height: 110 },
                      title: { x: 413 + X_OFF, y: 340, width: 130, height: 18 },
                      titleFontSize: 9,
                    },
                    {
                      id: 3,
                      draw: { x: 566 + X_OFF, y: 225, width: 130, height: 110 },
                      title: { x: 566 + X_OFF, y: 340, width: 130, height: 18 },
                      titleFontSize: 9,
                    },
                    {
                      id: 4,
                      draw: { x: 260 + X_OFF, y: 382, width: 130, height: 95 },
                      title: { x: 260 + X_OFF, y: 480, width: 130, height: 16 },
                      titleFontSize: 8,
                    },
                    {
                      id: 5,
                      draw: { x: 416 + X_OFF, y: 382, width: 130, height: 95 },
                      title: { x: 416 + X_OFF, y: 480, width: 130, height: 16 },
                      titleFontSize: 8,
                    },
                    {
                      id: 6,
                      draw: { x: 566 + X_OFF, y: 386, width: 130, height: 95 },
                      title: { x: 566 + X_OFF, y: 480, width: 130, height: 16 },
                      titleFontSize: 8,
                    },
                  ] as const
                    );
                  })()
                ).map((slot) => {
                  const index = slot.id - 1;
                  const idea = step3.ideas[index];
                  const drawing = idea.mode === 'draw' ? idea.content : '';
                  const title = (idea.title ?? (idea.mode === 'write' ? idea.content : '')).trimEnd();

                  // Use the exact calibrated rectangles from the PDF mapping (backend/pdf_mappings.py)
                  // so the 6 drawing boxes align perfectly with the template.
                  const drawRect = slot.draw;

                  return (
                    <React.Fragment key={slot.id}>
                      <PdfBox rect={drawRect}>
                        <CanvasDrawing
                          width={drawRect.width}
                          height={drawRect.height}
                          onSave={(content) => updateIdea(index, { mode: 'draw', content })}
                          initialData={drawing}
                          showClearButton
                          containerClassName="space-y-0"
                          canvasClassName="bg-transparent"
                          exportWithWhiteBackground
                        />
                      </PdfBox>

                      <PdfInputField
                        rect={{ ...slot.title, y: slot.id <= 3 ? slot.title.y + 12 : slot.title.y + 10, height: 28 }}
                        value={title}
                        onChangeAction={(value) => updateIdeaTitle(index, value)}
                        fontSize={slot.titleFontSize}
                        align="center"
                        padding={6}
                        placeholder=""
                      />
                    </React.Fragment>
                  );
                })}
              </PdfPage>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
