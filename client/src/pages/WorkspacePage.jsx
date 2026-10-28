import Card from '../components/common/Card';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';

const PIPELINE_STEPS = [
  'Optional deflate compression',
  'AES-256-GCM with ephemeral session key',
  'RSA-OAEP wrap of session key',
  'Envelope Ω saved via POST /api/payloads',
];

export default function WorkspacePage() {
  return (
    <>
      <PageHeader
        title="Workspace"
        description="Encrypt text or files in the browser before anything reaches the API."
      />
      <UpcomingFeatureBanner>
        Web Crypto pipeline and key unlock will run here. The server will only receive ciphertext envelopes.
      </UpcomingFeatureBanner>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Input">
          <textarea
            rows={8}
            readOnly
            aria-label="Plaintext input (upcoming feature)"
            value="Plaintext or file upload will be available in an upcoming release."
            className="w-full cursor-not-allowed resize-none rounded-lg border border-input-border bg-input px-3 py-2 text-sm text-muted-foreground"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-2 text-sm text-subtle-foreground"
            >
              Upload file
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-primary/50 px-4 py-2 text-sm text-primary-foreground/80"
            >
              Encrypt
            </button>
          </div>
        </Card>
        <Card title="Pipeline status">
          <ol className="space-y-3 text-sm">
            {PIPELINE_STEPS.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 rounded-lg border border-border bg-card px-3 py-2 text-muted-foreground"
              >
                <span className="font-mono text-subtle-foreground">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
