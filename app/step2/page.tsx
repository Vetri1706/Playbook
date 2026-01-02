'use client';

import React from 'react';
import PdfPage, { PdfBox, PdfInputField, PdfTextAreaField } from '@/components/PdfPage';
import CanvasDrawing from '@/components/CanvasDrawing';
import { usePlaybook } from '@/context/PlaybookContext';
import AppShell from '@/components/app/AppShell';
import TemplatePager from '@/components/app/TemplatePager';

export default function Step2Page() {
  const { user, step1, step2, updateUser, updateStep1, updateStep2 } = usePlaybook();

  return (
    <AppShell title="Step 2">
      <TemplatePager
        title="Define"
        routePrev="/step1"
        routeNext="/step3"
        pages={[
          {
            key: 'p4',
            label: 'Empathy map',
            content: (
              <PdfPage pageNumber={4}>
        {(() => {
          const X_OFF = -30;
          return (
            <>
        <PdfTextAreaField
          rect={{ x: 260 + X_OFF, y: 188, width: 150, height: 120 }}
          value={step2.who}
          onChangeAction={(value) => updateStep2({ who: value })}
          fontSize={9}
        />
        <PdfTextAreaField
          rect={{ x: 427 + X_OFF, y: 188, width: 150, height: 120 }}
          value={step2.what}
          onChangeAction={(value) => updateStep2({ what: value })}
          fontSize={9}
        />
        <PdfTextAreaField
          rect={{ x: 592 + X_OFF, y: 175, width: 150, height: 120 }}
          value={step2.when}
          onChangeAction={(value) => updateStep2({ when: value })}
          fontSize={9}
        />
        <PdfTextAreaField
          rect={{ x: 260 + X_OFF, y: 345, width: 150, height: 120 }}
          value={step2.when}
          onChangeAction={(value) => updateStep2({ when: value })}
          fontSize={9}
        />
        <PdfTextAreaField
          rect={{ x: 427 + X_OFF, y: 345, width: 150, height: 120 }}
          value={step1.feelings.mode === 'write' ? step1.feelings.content : ''}
          onChangeAction={(value) =>
            updateStep1({ feelings: { mode: 'write', content: value } })
          }
          fontSize={9}
          placeholder={step1.feelings.mode === 'draw' ? 'See drawing on next page' : ''}
          className={step1.feelings.mode === 'draw' ? 'opacity-50 pointer-events-none' : ''}
        />
        <PdfTextAreaField
          rect={{ x: 599 + X_OFF, y: 357, width: 145, height: 115 }}
          value={step2.why}
          onChangeAction={(value) => updateStep2({ why: value })}
          fontSize={9}
        />
            </>
          );
        })()}
              </PdfPage>
            ),
          },
          {
            key: 'p5',
            label: 'User profile',
            content: (
              <PdfPage pageNumber={5}>
        <PdfTextAreaField
          rect={{ x: 232, y: 133, width: 300, height: 70 }}
          value={step2.who || user.name}
          onChangeAction={(value) => updateStep2({ who: value })}
          fontSize={10}
        />
        <PdfInputField
          rect={{ x: 585, y: 133, width: 150, height: 70 }}
          value={user.age ? String(user.age) : ''}
          onChangeAction={(value) => updateUser({ age: parseInt(value) || 0 })}
          fontSize={10}
        />
        <PdfTextAreaField
          rect={{ x: 220, y: 240, width: 310, height: 65 }}
          value={step2.what}
          onChangeAction={(value) => updateStep2({ what: value })}
          fontSize={10}
        />
        <PdfTextAreaField
          rect={{ x: 583, y: 240, width: 150, height: 65 }}
          value={step2.when}
          onChangeAction={(value) => updateStep2({ when: value })}
          fontSize={10}
        />
        <PdfTextAreaField
          rect={{ x: 240, y: 338, width: 290, height: 65 }}
          value={step2.why}
          onChangeAction={(value) => updateStep2({ why: value })}
          fontSize={10}
        />
        <PdfTextAreaField
          rect={{ x: 583, y: 338, width: 150, height: 65 }}
          value={step2.wish}
          onChangeAction={(value) => updateStep2({ wish: value })}
          fontSize={10}
        />

        {(() => {
          // Keep very small inset just to avoid clipping against the template stroke.
          const inset = 2;
          const rect = { x: 43 + inset, y: 370 + inset, width: 130 - inset * 2, height: 110 - inset * 2 };
          return (
            <PdfBox rect={rect} className="rounded-full">
              <CanvasDrawing
                width={rect.width}
                height={rect.height}
                onSave={(drawing) =>
                  updateStep1({ feelings: { mode: 'draw', content: drawing } })
                }
                initialData={step1.feelings.mode === 'draw' ? step1.feelings.content : ''}
                showClearButton
                containerClassName="space-y-0"
                canvasClassName="bg-transparent"
                exportWithWhiteBackground
              />
            </PdfBox>
          );
        })()}
              </PdfPage>
            ),
          },
          {
            key: 'p6',
            label: 'Sad/Happy spaces',
            content: (
              <PdfPage pageNumber={6}>
        {(() => {
          const inset = 8;
          const rect = { x: 264 + inset, y: 165 + inset, width: 195 - inset * 2, height: 280 - inset * 2 };
          return (
            <PdfBox rect={rect} className="rounded-xl">
              <CanvasDrawing
                width={rect.width}
                height={rect.height}
                onSave={(drawing) =>
                  updateStep1({ sadSpace: { ...step1.sadSpace, drawing } })
                }
                initialData={step1.sadSpace.drawing}
                showClearButton
                containerClassName="space-y-0"
                canvasClassName="bg-transparent"
                exportWithWhiteBackground
              />
            </PdfBox>
          );
        })()}
        <PdfTextAreaField
          rect={{ x: 264, y: 450, width: 195, height: 40 }}
          value={step1.sadSpace.description}
          onChangeAction={(value) =>
            updateStep1({ sadSpace: { ...step1.sadSpace, description: value } })
          }
          fontSize={9}
          placeholder="(optional)"
        />

        {(() => {
          const inset = 8;
          const rect = { x: 472 + inset, y: 185 + inset, width: 195 - inset * 2, height: 260 - inset * 2 };
          return (
            <PdfBox rect={rect} className="rounded-xl">
              <CanvasDrawing
                width={rect.width}
                height={rect.height}
                onSave={(drawing) =>
                  updateStep1({ happySpace: { ...step1.happySpace, drawing } })
                }
                initialData={step1.happySpace.drawing}
                showClearButton
                containerClassName="space-y-0"
                canvasClassName="bg-transparent"
                exportWithWhiteBackground
              />
            </PdfBox>
          );
        })()}
        <PdfTextAreaField
          rect={{ x: 472, y: 450, width: 195, height: 40 }}
          value={step1.happySpace.description}
          onChangeAction={(value) =>
            updateStep1({ happySpace: { ...step1.happySpace, description: value } })
          }
          fontSize={9}
          placeholder="(optional)"
        />
      </PdfPage>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
