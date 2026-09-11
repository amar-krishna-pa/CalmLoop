import EditNameField from "@/app/components/profile/personal-info/EditNameField";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";

type Props = {
  name: string;
  email: string;
};

export default function PersonalInfoSection({ name, email }: Props) {
  return (
    <section className="mb-10">
      <h2 className="text-base font-semibold text-primary mb-4">
        Personal Info
      </h2>
      <div className="rounded-xl border border-subtle">
        <EditNameField initialName={name} />
        <HorizontalDivider />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted">Email</span>
          <span className="text-sm font-medium text-primary">{email}</span>
        </div>
      </div>
    </section>
  );
}
