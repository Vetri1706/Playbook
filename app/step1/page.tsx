'use client';

import PdfPage, { PdfBox, PdfInputField, PdfTextAreaField } from '@/components/PdfPage';
import CanvasDrawing from '@/components/CanvasDrawing';
import { usePlaybook } from '@/context/PlaybookContext';
import AppShell from '@/components/app/AppShell';
import TemplatePager from '@/components/app/TemplatePager';

export default function Step1Page() {
  const { user, step1, step2, updateUser, updateStep1, updateStep2 } = usePlaybook();

  return (
    <AppShell title="Empathize & Define">
      <TemplatePager
        title="Empathize & Define"
        routePrev="/"
        routeNext="/step2"
        pages={[
          { key: 'p2', label: 'Welcome', content: <PdfPage pageNumber={2} /> },
          {
            key: 'p3',
            label: 'Problem framing',
            content: (
              <PdfPage pageNumber={3}>
                <PdfTextAreaField
                  rect={{ x: 240, y: 120, width: 470, height: 135 }}
                  value={step1.problem}
                  onChangeAction={(value) => updateStep1({ problem: value })}
                  fontSize={12}
                  placeholder="Write the problem here"
                />

                <PdfTextAreaField
                  rect={{ x: 298, y: 286, width: 400, height: 45 }}
                  value={step2.who}
                  onChangeAction={(value) => updateStep2({ who: value })}
                  fontSize={11}
                  placeholder="(who?)"
                />

                <PdfTextAreaField
                  rect={{ x: 282, y: 346, width: 420, height: 130 }}
                  value={step2.why}
                  onChangeAction={(value) => updateStep2({ why: value })}
                  fontSize={11}
                  placeholder="(because...)"
                />
              </PdfPage>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
