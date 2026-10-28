import { Navigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import UpcomingFeatureBanner from '../../components/shared/UpcomingFeatureBanner';
import PageHeader from '../../components/shared/PageHeader';
import { getDocSection } from '../../content/documentationSections';

export default function DocSectionPage() {
  const { sectionSlug } = useParams();
  const section = getDocSection(sectionSlug);

  if (!section) {
    return <Navigate to="/docs/overview" replace />;
  }

  return (
    <>
      <PageHeader title={section.title} description={section.description} />
      <UpcomingFeatureBanner>
        Placeholder for this section. Replace with full documentation when the project is complete.
      </UpcomingFeatureBanner>
      <Card title="Planned topics">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-subtle-foreground">
          Status: pending
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
          {section.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
