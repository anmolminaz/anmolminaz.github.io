import ExternalLink from '@/components/ExternalLink';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Connect</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Get in Touch</h1>
        <p className="text-slate-500 text-sm leading-6 max-w-xl">
          Available for research collaborations, academic partnerships, teaching opportunities, and consulting in epidemiology and public health. Reach out with a brief description of your interest.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="py-7 first:pt-0 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 font-medium">Email</p>
            <p className="text-sm text-slate-600 leading-6">
              Best for research inquiries, collaboration proposals, and speaking engagements.
            </p>
          </div>
          <a
            href="mailto:anmol.minaz@alumni.emory.edu"
            className="shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-800 transition"
          >
            anmol.minaz@alumni.emory.edu
          </a>
        </div>

        <div className="py-7 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 font-medium">LinkedIn</p>
            <p className="text-sm text-slate-600 leading-6">
              Professional network and updates on current work.
            </p>
          </div>
          <ExternalLink
            href="https://www.linkedin.com/in/anmol-minaz"
            className="shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-800 transition"
          >
            linkedin.com/in/anmol-minaz
          </ExternalLink>
        </div>

        <div className="py-7 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 font-medium">Google Scholar</p>
            <p className="text-sm text-slate-600 leading-6">
              Publication record and citation metrics.
            </p>
          </div>
          <ExternalLink
            href="https://scholar.google.com/citations?user=anmolminaz"
            className="shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-800 transition"
          >
            Google Scholar
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
