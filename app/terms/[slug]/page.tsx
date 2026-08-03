import { notFound } from "next/navigation";
import { TermsContentView } from "@/components/common/TermsContentView";
import { TERMS_CONTENT } from "../_data/termsContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { slug } = await params;
  const doc = TERMS_CONTENT[slug];

  if (!doc) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-160 px-6 py-14">
      <h1 className="text-title-2 text-gray-500">{doc.title}</h1>
      <div className="mt-10">
        <TermsContentView doc={doc} />
      </div>
    </main>
  );
}
