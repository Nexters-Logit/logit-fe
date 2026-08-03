import { notFound } from "next/navigation";
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
      <p className="mt-2 text-body-8-1 text-gray-200">시행일 {doc.updatedAt}</p>

      <div className="mt-10 flex flex-col gap-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-body-3-2 text-gray-500">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-2.5">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body-6-2 leading-relaxed text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
