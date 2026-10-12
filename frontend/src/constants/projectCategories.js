// Badge text for a project: "College Project · ML" when it has a subcategory.
export const categoryLabel = (project, fallback) =>
  [project.category, project.subcategory].filter(Boolean).join(' · ') || fallback
