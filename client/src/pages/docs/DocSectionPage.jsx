import { Navigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import DocContent from '../../components/docs/DocContent';
import PageHeader from '../../components/shared/PageHeader';
import { getDocContent } from '../../content/documentationContent';
import { getDocSection } from '../../content/documentationSections';

export default function DocSectionPage() {
  const { sectionSlug } = useParams();
  const section = getDocSection(sectionSlug);
  const content = getDocContent(sectionSlug);

  if (!section) {
    return <Navigate to="/docs/overview" replace />;
  }

  return (
    <>
      <PageHeader title={section.title} description={section.description} />
      <Card>
        {content ? (
          <DocContent content={content} />
        ) : (
          <p className="text-sm text-muted-foreground">Content for this section is not available yet.</p>
        )}
      </Card>
    </>
  );
}
