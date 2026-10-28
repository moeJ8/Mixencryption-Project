import Card from '../components/common/Card';
import Button from '../components/common/Button';
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
            <Button type="button" variant="secondary" disabled>
              Upload file
            </Button>
            <Button type="button" disabled>
              Encrypt
            </Button>
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
