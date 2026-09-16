import { resume } from '@/data/resume'

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {resume.profile.name}.{' '}
        {resume.footer.builtWith}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        {resume.profile.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline underline-offset-4 hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
