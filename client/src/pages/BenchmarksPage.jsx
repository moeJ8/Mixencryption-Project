import Card from '../components/common/Card';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';

const PAYLOAD_SIZES = ['1 KB', '10 KB', '100 KB', '500 KB', '1 MB', '5 MB'];

export default function BenchmarksPage() {
  return (
    <>
      <PageHeader
        title="Benchmarks"
        description="Measure latency, ciphertext expansion, and throughput for fixed payload sizes."
      />
      <UpcomingFeatureBanner>
        Recharts will plot real timings from the browser crypto pipeline, with and without compression.
      </UpcomingFeatureBanner>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Latency">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
            <p className="text-sm text-subtle-foreground">T_total split chart</p>
          </div>
        </Card>
        <Card title="Size overhead">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
            <p className="text-sm text-subtle-foreground">R_size chart</p>
          </div>
        </Card>
        <Card title="Target payload sizes" className="md:col-span-2">
          <ul className="flex flex-wrap gap-2">
            {PAYLOAD_SIZES.map((size) => (
              <li
                key={size}
                className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {size}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
