import { ProjectRowSkeleton } from "./ProjectRowSkeleton";

export function ProjectListSkeleton() {
  return (
    <div className="mt-5">
      {[1, 2, 3].map((i) => (
        <ProjectRowSkeleton key={i} />
      ))}
    </div>
  );
}
