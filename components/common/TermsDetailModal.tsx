"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TermsContentView } from "./TermsContentView";
import { TERMS_CONTENT } from "@/app/terms/_data/termsContent";

type Props = {
  slug: string | null;
  onClose: () => void;
};

export function TermsDetailModal({ slug, onClose }: Props) {
  const doc = slug ? TERMS_CONTENT[slug] : null;

  return (
    <Dialog open={!!doc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[85vh] w-full max-w-160 flex-col overflow-hidden rounded-3xl p-0">
        {doc && (
          <>
            <div className="shrink-0 border-b border-gray-70 py-5 pr-14 pl-6 sm:pl-8">
              <DialogTitle className="text-title-3 text-gray-500">{doc.title}</DialogTitle>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <TermsContentView doc={doc} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
