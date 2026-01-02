'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STEPS } from '@/utils/constants';
import PageTransition from './PageTransition';
import { Button } from '@/components/ui/Button';

type NavItem = { label: string; href: string };

function useNav(): NavItem[] {
  return useMemo(() => {
    const stepItems = STEPS.map((s) => ({ label: `Step ${s.number}: ${s.title}`, href: `/step${s.number}` }));
    return [
      { label: 'Start', href: '/' },
      ...stepItems,
      { label: 'Print Preview', href: '/print' },
    ];
  }, []);
}

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const nav = useNav();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeHref = nav.find((n) => pathname === n.href)?.href;

  return (
    <div className="min-h-screen text-sns-dark relative">
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-rainbow animate-rainbow motion-reduce:animate-none transition-opacity duration-700"
      />
      <div aria-hidden className="fixed inset-0 -z-10 bg-sns-light-green/80" />
      {/* Top bar (mobile only) */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur no-print md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          >
            Menu
          </Button>
          <div className="flex-1">
            <div className="text-sm font-semibold">SNS Design Thinking Playbook</div>
            {title ? <div className="text-xs text-gray-600">{title}</div> : null}
          </div>
          <Link href="/print" className="hidden sm:block">
            <Button variant="secondary">Print</Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block w-72 shrink-0 py-6 no-print">
            <nav className="bg-white border border-gray-200 rounded-lg p-2">
              {nav.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      'block rounded-md px-3 py-2 text-sm ' +
                      (active
                        ? 'bg-sns-orange/10 text-sns-dark font-semibold'
                        : 'text-gray-700 hover:bg-gray-50')
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>

      {/* Drawer (mobile) */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden no-print" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white border-r border-gray-200 p-3">
            <div className="flex items-center justify-between px-1 py-2">
              <div className="text-sm font-semibold">Navigation</div>
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
            </div>
            <nav className="mt-2">
              {nav.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={
                      'block rounded-md px-3 py-2 text-sm ' +
                      (active
                        ? 'bg-sns-orange/10 text-sns-dark font-semibold'
                        : 'text-gray-700 hover:bg-gray-50')
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
