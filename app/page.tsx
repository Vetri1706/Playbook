'use client';

import Link from 'next/link';
import PdfPage, { PdfBox, PdfInputField } from '@/components/PdfPage';
import AppShell from '@/components/app/AppShell';
import { usePlaybook } from '@/context/PlaybookContext';

export default function HomePage() {
  const { user, updateUser } = usePlaybook();

  return (
    <AppShell title="Start">
      <PdfPage pageNumber={1}>
        <PdfInputField
          rect={{ x: 180, y: 375, width: 400, height: 50 }}
          value={user.name}
          onChangeAction={(value) => updateUser({ name: value })}
          align="center"
          fontSize={20}
          padding={0}
          className="font-semibold"
          placeholder="Your name"
        />

        <PdfBox rect={{ x: 560, y: 500, width: 190, height: 50 }}>
          <Link
            href="/step1"
            className="inline-flex items-center justify-center w-full h-full rounded-md bg-sns-green text-white font-semibold"
          >
            Start →
          </Link>
        </PdfBox>
      </PdfPage>
    </AppShell>
  );
}
