import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/common/Table';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';

const PAYLOAD_SIZES = ['1 KB', '10 KB', '100 KB', '500 KB', '1 MB', '5 MB'];

const LAB_ALGORITHMS = [
  { name: 'AES-GCM (256-bit)', source: 'Live (Web Crypto)' },
  { name: 'ChaCha20-Poly1305', source: 'Live if supported' },
  { name: 'AES-CBC (256-bit)', source: 'Live (confidentiality only, not AEAD)' },
  { name: 'AES-CCM (256-bit)', source: 'Reference (not in Web Crypto)' },
  { name: 'Triple DES (3DES-CBC)', source: 'Reference (not in Web Crypto)' },
];

export default function CryptoLabPage() {
  return (
    <>
      <PageHeader
        title="Crypto lab"
        description="Compare symmetric primitive speed on fixed payload sizes. Vault encryption stays AES-256-GCM plus RSA-OAEP only."
      />
      <UpcomingFeatureBanner>
        Run comparison will benchmark encrypt/decrypt in this browser where Web Crypto allows it.
        Algorithms the API does not expose can show documented reference timings in the table. Nothing
        from this page is stored in the vault.
      </UpcomingFeatureBanner>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Payload size">
          <select
            disabled
            aria-label="Payload size (upcoming feature)"
            className="w-full cursor-not-allowed rounded-lg border border-input-border bg-input px-3 py-2 text-sm text-muted-foreground"
            defaultValue="1 MB"
          >
            {PAYLOAD_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Button type="button" variant="secondary" fullWidth disabled className="mt-3">
            Run comparison
          </Button>
        </Card>
        <Card title="Metrics" className="sm:col-span-1 lg:col-span-2">
          <p className="text-sm text-muted-foreground">
            Median execution time (seconds) and throughput (MB/s) over repeated rounds on random
            data, after warm-up.
          </p>
        </Card>
      </div>

      <Card title="Algorithm comparison (placeholder)">
        <DataTable minWidth="32rem" maxBodyHeight="18rem" scrollAriaLabel="Algorithm comparison">
          <TableHeader sticky>
            <TableRow className="hover:bg-transparent">
              <TableHead>Algorithm</TableHead>
              <TableHead>Execution time</TableHead>
              <TableHead>Throughput</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LAB_ALGORITHMS.map((row) => (
              <TableRow key={row.name}>
                <TableCell tone="monoStrong">{row.name}</TableCell>
                <TableCell tone="muted">Pending</TableCell>
                <TableCell tone="muted">Pending</TableCell>
                <TableCell tone="subtle">{row.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
          <p className="text-sm text-subtle-foreground">Bar chart (Recharts) after live runs</p>
        </div>
      </Card>
    </>
  );
}
