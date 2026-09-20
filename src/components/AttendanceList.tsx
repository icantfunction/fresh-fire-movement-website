import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Registration {
  registrationId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  yearsAtClc: number;
  encounterCollide: boolean;
  dateOfBirth: string;
  grade: string;
  audition: boolean;
  present: boolean;
  createdAt: string;
}

interface AttendanceListProps {
  registrations: Registration[];
  isLoading: boolean;
  savingId: string | null;
  isSaving: boolean;
  emptyMessage: string;
  onToggle: (registrationId: string, present: boolean) => void;
}

export function AttendanceList({
  registrations,
  isLoading,
  savingId,
  isSaving,
  emptyMessage,
  onToggle,
}: AttendanceListProps) {
  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading registrations...
      </div>
    );
  }

  if (registrations.length === 0) {
    return <p className="p-6 text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul aria-label="Attendance check-in" className="divide-y">
      {registrations.map((registration) => {
        const name = `${registration.firstName} ${registration.lastName}`.trim();
        const saving = savingId === registration.registrationId;
        return (
          <li key={registration.registrationId} className="min-w-0 p-4 sm:px-6">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <p className="break-words text-base font-semibold">{name}</p>
                <p className="mt-1 break-words text-sm text-muted-foreground">{registration.phoneNumber}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                <span
                  aria-live="polite"
                  className={`inline-flex min-w-20 items-center justify-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    registration.present ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {registration.present && <Check className="h-4 w-4" aria-hidden="true" />}
                  {registration.present ? "Here" : "Not here"}
                </span>
                <Button
                  type="button"
                  aria-label={`${registration.present ? "Mark not here" : "Mark here"}: ${name}`}
                  aria-busy={saving}
                  disabled={isSaving}
                  onClick={() => onToggle(registration.registrationId, !registration.present)}
                  className={`min-h-11 min-w-36 flex-1 sm:flex-none ${
                    registration.present
                      ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      : "bg-fire-purple hover:bg-fire-purple/90"
                  }`}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {saving ? "Saving..." : registration.present ? "Mark not here" : "Mark here"}
                </Button>
              </div>
            </div>
            <details className="mt-2 text-sm">
              <summary className="w-fit cursor-pointer rounded py-3 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Registration details<span className="sr-only"> for {name}</span>
              </summary>
              <dl className="grid grid-cols-1 gap-4 rounded-md bg-muted/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Years at CLC", registration.yearsAtClc],
                  ["Encounter/Collide", registration.encounterCollide ? "Yes" : "No"],
                  ["Date of birth", registration.dateOfBirth || "N/A"],
                  ["Grade", registration.grade || "N/A"],
                  ["Audition", registration.audition ? "Yes" : "No"],
                  ["Signup date", registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : "N/A"],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="break-words font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
