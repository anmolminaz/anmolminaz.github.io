export default function AuthorList({ authors }: { authors: string }) {
  if (!authors) return null;
  const parts = authors.split(/(Minaz,?\s+A\.?)/i);
  return (
    <>
      {parts.map((part, i) =>
        /minaz/i.test(part)
          ? <strong key={i} className="font-semibold text-slate-800">{part}</strong>
          : part
      )}
    </>
  );
}
