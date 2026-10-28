import { NavLink, Outlet } from "react-router-dom";
import { DOC_SECTIONS } from "../../content/documentationSections";
import { sidebarLinkClass } from "../shared/navStyles";

export default function DocumentationLayout() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <aside className="shrink-0 lg:w-56">
        <div className="rounded-xl border border-border bg-card p-3 shadow-card lg:sticky lg:top-24">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
            Documentation
          </p>
          <nav
            aria-label="Documentation sections"
            className="flex flex-col gap-0.5"
          >
            {DOC_SECTIONS.map((section) => (
              <NavLink
                key={section.slug}
                to={`/docs/${section.slug}`}
                className={sidebarLinkClass}
              >
                {section.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
