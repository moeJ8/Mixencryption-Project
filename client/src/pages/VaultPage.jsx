import Card from '../components/common/Card';
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
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-2 text-sm text-subtle-foreground"
          >
            Decrypt selected
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-2 text-sm text-subtle-foreground"
          >
            Bit-flip tamper demo
          </button>
        </div>
      </Card>
    </>
  );
}
