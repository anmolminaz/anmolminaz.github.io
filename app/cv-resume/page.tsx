export default function CVResumePage() {
  const cvUrl = process.env.CV_URL || '/cv.pdf';
  const resumeUrl = process.env.RESUME_URL || '/resume.pdf';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Documents</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">CV / Resume</h1>
        <p className="text-slate-500 text-sm leading-6">
          The CV provides a complete record of academic and professional experience, publications, and research outputs. The resume is a concise version for quick evaluation.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="py-7 first:pt-0 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Curriculum Vitae</h2>
            <p className="text-sm text-slate-500 leading-6">
              Full academic record — research projects, publications, teaching, and professional history.
            </p>
          </div>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 btn-primary inline-flex items-center gap-2"
          >
            Download CV ↓
          </a>
        </div>

        <div className="py-7 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Resume</h2>
            <p className="text-sm text-slate-500 leading-6">
              Concise summary of qualifications, key accomplishments, and technical skills.
            </p>
          </div>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 btn-secondary inline-flex items-center gap-2"
          >
            Download Resume ↓
          </a>
        </div>
      </div>
    </div>
  );
}
