import type { TermsDoc } from "@/app/terms/_data/termsContent";

export function TermsContentView({ doc }: { doc: TermsDoc }) {
  return (
    <div>
      <p className="text-body-8-1 text-gray-200">시행일 {doc.updatedAt}</p>
      <div className="mt-6 flex flex-col gap-6">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-body-3-2 text-gray-500">{section.heading}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body-6-2 leading-relaxed text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
