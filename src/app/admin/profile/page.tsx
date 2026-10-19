import { getProfile } from "@/lib/queries";
import { saveProfile } from "@/lib/actions";
import { Field, SubmitRow, TextArea } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { ActionAlert } from "@/components/admin/ActionAlert";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [profile, params] = await Promise.all([getProfile(), searchParams]);

  return (
    <div>
      <ActionAlert error={params.error} />
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted">Your name, headline, bio and social links.</p>

      {params.saved ? (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-accent">
          Profile saved.
        </p>
      ) : null}

      <form action={saveProfile} className="mt-8 space-y-5">
        <Field label="Name" name="name" defaultValue={profile.name} required />
        <Field
          label="Headline"
          name="headline"
          defaultValue={profile.headline}
          required
          placeholder="Senior Software Engineer · Rails, Node, Python & AI systems"
        />
        <TextArea label="Bio" name="bio" defaultValue={profile.bio} rows={4} required />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location" name="location" defaultValue={profile.location} placeholder="Lahore, Pakistan" />
          <Field
            label="Years of experience"
            name="yearsExperience"
            type="number"
            defaultValue={profile.yearsExperience}
          />
          <Field label="Email" name="email" type="email" defaultValue={profile.email} />
          <Field
            label="Phone"
            name="phone"
            defaultValue={profile.phone}
            placeholder="+92 300 1234567"
            hint="Shown publicly in the contact section."
          />
          <Field label="Résumé URL" name="resumeUrl" defaultValue={profile.resumeUrl} />
          <Field label="GitHub URL" name="githubUrl" defaultValue={profile.githubUrl} />
          <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={profile.linkedinUrl} />
          <Field label="Twitter URL" name="twitterUrl" defaultValue={profile.twitterUrl} />
        </div>

        <ImageField name="avatarUrl" label="Avatar" defaultValue={profile.avatarUrl} />

        <Field
          label="Intro video"
          name="introVideoUrl"
          defaultValue={profile.introVideoUrl}
          placeholder="https://youtu.be/… or https://www.loom.com/share/…"
          hint="YouTube, Vimeo or Loom link, or a direct .mp4 URL. It autoplays muted at the top of the page with a button to turn sound on. Leave blank to hide it."
        />

        <SubmitRow />
      </form>
    </div>
  );
}
