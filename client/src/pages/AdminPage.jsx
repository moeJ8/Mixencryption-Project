import Card from '../components/common/Card';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Admin only: user directory and audit feed. No password hashes, wrapped keys, or plaintext."
      />
      <UpcomingFeatureBanner>
        GET /api/admin/users and GET /api/admin/audit will power these tables. Access is limited to the admin role.
      </UpcomingFeatureBanner>
      <div className="grid gap-6">
        <Card title="Users">
          <div className="-mx-1 overflow-x-auto rounded-lg border border-border sm:mx-0">
            <table className="min-w-[28rem] w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-subtle-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Username</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Verified</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                    User list will load from the API.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Audit log">
          <div className="-mx-1 overflow-x-auto rounded-lg border border-border sm:mx-0">
            <table className="min-w-[32rem] w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-subtle-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                    Audit events will append here (read-only).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
