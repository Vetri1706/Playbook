'use client';

import React from 'react';
import PdfPage, { PdfBox, PdfInputField, PdfTextAreaField } from '@/components/PdfPage';
import CanvasDrawing from '@/components/CanvasDrawing';
import { usePlaybook } from '@/context/PlaybookContext';
import AppShell from '@/components/app/AppShell';
import TemplatePager from '@/components/app/TemplatePager';

export default function Step5Page() {
  const { step5, updateStep5 } = usePlaybook();
  return (
    <AppShell title="Step 5">
      <TemplatePager
        title="Prototype"
        routePrev="/step4"
        routeNext="/print"
        pages={[
          {
            key: 'p10',
            label: 'Prototype drawing',
            content: (
              <PdfPage pageNumber={10}>
                {(() => {
                  const inset = 10;
                  const rect = { x: 229 + inset, y: 185 + inset, width: 500 - inset * 2, height: 285 - inset * 2 };
                  return (
                    <PdfBox rect={rect} className="rounded-xl">
                      <CanvasDrawing
                        width={rect.width}
                        height={rect.height}
                        onSave={(content) =>
                          updateStep5({ bestIdea: { mode: 'draw', content } })
                        }
                        initialData={step5.bestIdea.mode === 'draw' ? step5.bestIdea.content : ''}
                        showClearButton
                        containerClassName="space-y-0"
                        canvasClassName="bg-transparent"
                        exportWithWhiteBackground
                      />
                    </PdfBox>
                  );
                })()}

                <PdfInputField
                  rect={{ x: 525, y: 483, width: 165, height: 30 }}
                  value={step5.ideaName}
                  onChangeAction={(value) => updateStep5({ ideaName: value })}
                  fontSize={11}
                  padding={2}
                />
              </PdfPage>
            ),
          },
          { key: 'p11', label: 'Template page', content: <PdfPage pageNumber={11} /> },
          {
            key: 'p12',
            label: 'Final thought',
            content: (
              <PdfPage pageNumber={12}>
                <PdfTextAreaField
                  rect={{ x: 100, y: 200, width: 560, height: 180 }}
                  value={step5.summary}
                  onChangeAction={(value) => updateStep5({ summary: value })}
                  fontSize={14}
                  align="center"
                  placeholder="Write your final thought"
                />
              </PdfPage>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
