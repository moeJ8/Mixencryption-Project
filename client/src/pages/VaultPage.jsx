import Card from '../components/common/Card';
import Button from '../components/common/Button';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';

export default function VaultPage() {
  return (
    <>
      <PageHeader
        title="Vault"
        description="Your encrypted envelopes. Decrypt only in this browser with your unlocked private key."
      />
      <UpcomingFeatureBanner>
        Payload list and decrypt flow will connect to GET /api/payloads. A bit-flip demo will show GCM tag failure.
      </UpcomingFeatureBanner>
      <Card title="Envelopes">
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No envelopes yet.</p>
          <p className="mt-1 text-xs text-subtle-foreground">
            Encrypted items from Workspace will appear here.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="secondary" disabled>
            Decrypt selected
          </Button>
          <Button type="button" variant="secondary" disabled>
            Bit-flip tamper demo
          </Button>
        </div>
      </Card>
    </>
  );
}
