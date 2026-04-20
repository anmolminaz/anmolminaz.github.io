export default function Footer() {
  return (
    <footer className="border-t-2 border-teal-600 bg-white mt-20">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Anmol Minaz</p>
        <div className="flex flex-wrap justify-center gap-5 text-sm">
          <a
            href="https://scholar.google.com/citations?user=anmolminaz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 font-medium hover:text-teal-800 transition"
          >
            Google Scholar
          </a>
          <a href="mailto:anmol.minaz@alumni.emory.edu" className="text-slate-500 hover:text-teal-700 transition">
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/anmol-minaz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-teal-700 transition"
          >
            LinkedIn
          </a>
          <a href="/cv-resume" className="text-slate-500 hover:text-teal-700 transition">
            CV
          </a>
        </div>
      </div>
    </footer>
  );
}
