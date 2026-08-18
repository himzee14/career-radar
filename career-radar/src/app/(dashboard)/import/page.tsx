import { ImportForm } from "@/components/ImportForm";

export default function ImportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Import jobs</h1>
        <p className="text-sm text-ink-500 mt-1">
          Bring in jobs from a discovery pass, or add one you found yourself.
        </p>
      </div>
      <ImportForm />
    </div>
  );
}
