import PasskeySection from "@/app/components/profile/security/PasskeySection";
import PersonalInfoSection from "@/app/components/profile/personal-info/PersonalInfoSection";

type Props = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function TherapistProfile({ user }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
      <p className="text-sm text-muted mb-10">
        Manage your professional profile.
      </p>

      <PersonalInfoSection name={user.name} email={user.email} />

      <section className="mb-10">
        <h2 className="text-base font-semibold text-primary mb-4">
          Professional Info
        </h2>
        <div className="rounded-xl border border-subtle">
          {/* therapist-specific fields (bio, specialties, license) go here */}
        </div>
      </section>

      <PasskeySection />
    </div>
  );
}
