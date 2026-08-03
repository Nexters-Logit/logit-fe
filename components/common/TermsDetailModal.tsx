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
      <DialogContent className="max-h-[80vh] w-full max-w-160 overflow-y-auto rounded-3xl p-8">
        {doc && (
          <>
            <DialogTitle className="text-title-3 text-gray-500">{doc.title}</DialogTitle>
            <div className="mt-4">
              <TermsContentView doc={doc} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
