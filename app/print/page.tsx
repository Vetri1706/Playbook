'use client';

import React from 'react';
import Link from 'next/link';
import { usePlaybook } from '@/context/PlaybookContext';
import { generatePDF, printPage } from '@/utils/pdfGenerator';
import PdfPage, { PdfBox, PdfInputField, PdfTextAreaField } from '@/components/PdfPage';
import CanvasDrawing from '@/components/CanvasDrawing';
import AppShell from '@/components/app/AppShell';
import { Button } from '@/components/ui/Button';

export default function PrintPage() {
  const { user, step1, step2, step3, step4, step5 } = usePlaybook();

  const handleDownloadPDF = async () => {
    const filename = `${user.name || 'my'}-design-thinking-playbook.pdf`;
    await generatePDF({ user, step1, step2, step3, step4, step5 }, filename);
  };

  return (
    <AppShell title="Print Preview">
      <div className="no-print flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="text-sm font-semibold">Print Preview</div>
        <div className="flex gap-2">
          <Link href="/step5">
            <Button variant="secondary">Back to edit</Button>
          </Link>
          <Button variant="secondary" onClick={printPage}>
            Print
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        <PdfPage pageNumber={1}>
          <PdfInputField
            rect={{ x: 180, y: 375, width: 400, height: 50 }}
            value={user.name}
            onChangeAction={() => {}}
            align="center"
            fontSize={20}
            padding={0}
            className="font-semibold pointer-events-none"
          />
        </PdfPage>

        <PdfPage pageNumber={2} />

        <PdfPage pageNumber={3}>
          <PdfTextAreaField
            rect={{ x: 240, y: 120, width: 470, height: 135 }}
            value={step1.problem}
            onChangeAction={() => {}}
            fontSize={12}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 298, y: 286, width: 400, height: 45 }}
            value={step2.who}
            onChangeAction={() => {}}
            fontSize={11}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 282, y: 346, width: 420, height: 130 }}
            value={step2.why}
            onChangeAction={() => {}}
            fontSize={11}
            className="pointer-events-none"
          />
        </PdfPage>

        <PdfPage pageNumber={4}>
          {(() => {
            const X_OFF = -30;
            return (
              <>
          <PdfTextAreaField
            rect={{ x: 260 + X_OFF, y: 188, width: 150, height: 120 }}
            value={step2.who}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 427 + X_OFF, y: 188, width: 150, height: 120 }}
            value={step2.what}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 592 + X_OFF, y: 175, width: 150, height: 120 }}
            value={step2.when}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 260 + X_OFF, y: 345, width: 150, height: 120 }}
            value={step2.when}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 427 + X_OFF, y: 345, width: 150, height: 120 }}
            value={step1.feelings.mode === 'write' ? step1.feelings.content : ''}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 599 + X_OFF, y: 357, width: 145, height: 115 }}
            value={step2.why}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
              </>
            );
          })()}
        </PdfPage>

        <PdfPage pageNumber={5}>
          <PdfTextAreaField
            rect={{ x: 232, y: 133, width: 300, height: 70 }}
            value={step2.who || user.name}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />
          <PdfInputField
            rect={{ x: 585, y: 133, width: 150, height: 70 }}
            value={user.age ? String(user.age) : ''}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 220, y: 240, width: 310, height: 65 }}
            value={step2.what}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 583, y: 240, width: 150, height: 65 }}
            value={step2.when}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 240, y: 338, width: 290, height: 65 }}
            value={step2.why}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />
          <PdfTextAreaField
            rect={{ x: 583, y: 338, width: 150, height: 65 }}
            value={step2.wish}
            onChangeAction={() => {}}
            fontSize={10}
            className="pointer-events-none"
          />

          {(() => {
            const inset = 10;
            const rect = { x: 43 + inset, y: 370 + inset, width: 130 - inset * 2, height: 110 - inset * 2 };
            return (
              <PdfBox rect={rect} className="rounded-full">
                <CanvasDrawing
                  width={rect.width}
                  height={rect.height}
                  onSave={() => {}}
                  initialData={step1.feelings.mode === 'draw' ? step1.feelings.content : ''}
                  showClearButton={false}
                  containerClassName="space-y-0"
                  canvasClassName="bg-transparent pointer-events-none"
                  exportWithWhiteBackground
                />
              </PdfBox>
            );
          })()}
        </PdfPage>

        <PdfPage pageNumber={6}>
          {(() => {
            const inset = 8;
            const rect = { x: 264 + inset, y: 165 + inset, width: 195 - inset * 2, height: 280 - inset * 2 };
            return (
              <PdfBox rect={rect} className="rounded-xl">
                <CanvasDrawing
                  width={rect.width}
                  height={rect.height}
                  onSave={() => {}}
                  initialData={step1.sadSpace.drawing}
                  showClearButton={false}
                  containerClassName="space-y-0"
                  canvasClassName="bg-transparent pointer-events-none"
                  exportWithWhiteBackground
                />
              </PdfBox>
            );
          })()}
          <PdfTextAreaField
            rect={{ x: 264, y: 450, width: 195, height: 40 }}
            value={step1.sadSpace.description}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />

          {(() => {
            const inset = 8;
            const rect = { x: 472 + inset, y: 185 + inset, width: 195 - inset * 2, height: 260 - inset * 2 };
            return (
              <PdfBox rect={rect} className="rounded-xl">
                <CanvasDrawing
                  width={rect.width}
                  height={rect.height}
                  onSave={() => {}}
                  initialData={step1.happySpace.drawing}
                  showClearButton={false}
                  containerClassName="space-y-0"
                  canvasClassName="bg-transparent pointer-events-none"
                  exportWithWhiteBackground
                />
              </PdfBox>
            );
          })()}
          <PdfTextAreaField
            rect={{ x: 472, y: 450, width: 195, height: 40 }}
            value={step1.happySpace.description}
            onChangeAction={() => {}}
            fontSize={9}
            className="pointer-events-none"
          />
        </PdfPage>

        <PdfPage pageNumber={7}>
          {(() => {
            const lines = (step3.productStatement || '').split('\n');
            const getLine = (i: number) => (lines[i] ?? '').trimEnd();
            const barX = 225;
            const barW = 430;
            const barH = 46;
            const barYs = [210, 280, 350];

            return (
              <>
                <PdfInputField
                  rect={{ x: barX, y: barYs[0], width: barW, height: barH }}
                  value={getLine(0)}
                  onChangeAction={() => {}}
                  fontSize={14}
                  padding={10}
                  className="pointer-events-none"
                />
                <PdfInputField
                  rect={{ x: barX, y: barYs[1], width: barW, height: barH }}
                  value={getLine(1)}
                  onChangeAction={() => {}}
                  fontSize={14}
                  padding={10}
                  className="pointer-events-none"
                />
                <PdfInputField
                  rect={{ x: barX, y: barYs[2], width: barW, height: barH }}
                  value={getLine(2)}
                  onChangeAction={() => {}}
                  fontSize={14}
                  padding={10}
                  className="pointer-events-none"
                />
              </>
            );
          })()}
        </PdfPage>

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
            const drawing = idea?.mode === 'draw' ? idea.content : '';
            const title = (idea?.title ?? (idea?.mode === 'write' ? idea?.content : '')).trimEnd();

            const drawRect = slot.draw;

            return (
              <React.Fragment key={slot.id}>
                <PdfBox rect={drawRect}>
                  <CanvasDrawing
                    width={drawRect.width}
                    height={drawRect.height}
                    onSave={() => {}}
                    initialData={drawing}
                    showClearButton={false}
                    containerClassName="space-y-0"
                    canvasClassName="bg-transparent pointer-events-none"
                    exportWithWhiteBackground
                  />
                </PdfBox>

                <PdfInputField
                  rect={{ ...slot.title, y: slot.id <= 3 ? slot.title.y + 12 : slot.title.y + 10, height: 28 }}
                  value={title}
                  onChangeAction={() => {}}
                  fontSize={slot.titleFontSize}
                  align="center"
                  padding={6}
                  className="pointer-events-none"
                  placeholder=""
                />
              </React.Fragment>
            );
          })}
        </PdfPage>

        <PdfPage pageNumber={9}>
          <PdfInputField
            rect={{ x: 540, y: 148, width: 200, height: 25 }}
            value={step5.ideaName}
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
                    readOnly
                    className="absolute bg-transparent text-sns-dark focus:outline-none pointer-events-none"
                    style={{ left: ideaX, top: y, width: ideaW, height: inputH, fontSize: 11 }}
                  />
                  <input
                    type="text"
                    value={String(evalRow?.score ?? 5)}
                    readOnly
                    className="absolute bg-transparent text-sns-dark focus:outline-none pointer-events-none"
                    style={{ left: scoreX, top: y, width: scoreW, height: inputH, fontSize: 12 }}
                  />
                  <input
                    type="text"
                    value={evalRow?.solvesProblem === 'yes' ? 'Yes' : evalRow?.solvesProblem === 'no' ? 'No' : ''}
                    readOnly
                    className="absolute bg-transparent text-sns-dark focus:outline-none pointer-events-none"
                    style={{ left: solveX, top: y, width: solveW, height: inputH, fontSize: 12 }}
                  />
                </React.Fragment>
              );
            });
          })()}
        </PdfPage>

        <PdfPage pageNumber={10}>
          {(() => {
            const inset = 10;
            const rect = { x: 229 + inset, y: 185 + inset, width: 500 - inset * 2, height: 285 - inset * 2 };
            return (
              <PdfBox rect={rect} className="rounded-xl">
                <CanvasDrawing
                  width={rect.width}
                  height={rect.height}
                  onSave={() => {}}
                  initialData={step5.bestIdea.mode === 'draw' ? step5.bestIdea.content : ''}
                  showClearButton={false}
                  containerClassName="space-y-0"
                  canvasClassName="bg-transparent pointer-events-none"
                  exportWithWhiteBackground
                />
              </PdfBox>
            );
          })()}

          <PdfInputField
            rect={{ x: 525, y: 483, width: 165, height: 30 }}
            value={step5.ideaName}
            onChangeAction={() => {}}
            fontSize={11}
            padding={2}
            className="pointer-events-none"
          />
        </PdfPage>

        <PdfPage pageNumber={11} />

        <PdfPage pageNumber={12}>
          <PdfTextAreaField
            rect={{ x: 100, y: 200, width: 560, height: 180 }}
            value={step5.summary}
            onChangeAction={() => {}}
            fontSize={14}
            align="center"
            className="pointer-events-none"
          />
        </PdfPage>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
