'use client';

import { ReactNode } from 'react';
import { ChatPanel } from './ChatPanel';
import { useChatStore } from '../../_store/useChatStore';

interface SidePanelClientProps {
  experienceCards: ReactNode;
}

export function SidePanelClient({ experienceCards }: SidePanelClientProps) {
  const maxLength = useChatStore((s) => s.maxLength);

  return <ChatPanel maxLength={maxLength} experienceCards={experienceCards} />;
}
