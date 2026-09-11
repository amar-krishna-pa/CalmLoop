import PasskeySection from "@/app/components/profile/security/PasskeySection";
import PersonalInfoSection from "@/app/components/profile/personal-info/PersonalInfoSection";

type Props = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function PatientProfile({ user }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
      <p className="text-sm text-muted mb-10">
        Manage your personal information.
      </p>

      <PersonalInfoSection name={user.name} email={user.email} />

      <PasskeySection />
    </div>
  );
}
