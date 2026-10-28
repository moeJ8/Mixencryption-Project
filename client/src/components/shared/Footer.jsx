import { Github } from 'lucide-react';

const GITHUB_REPO = 'https://github.com/moeJ8/Mixencryption-Project';
const USKUDAR_UNIVERSITY_URL = 'https://uskudar.edu.tr/en';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-sm font-semibold text-foreground">MixEncryption</p>

        <div className="flex items-center gap-2.5 md:max-w-md">
          <a
            href={USKUDAR_UNIVERSITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Üsküdar University website"
          >
            <img
              src="/uskudar-universitesi-logo.png"
              alt=""
              className="h-8 w-auto object-contain"
              width={80}
              height={32}
              loading="lazy"
            />
          </a>
          <p className="text-[11px] leading-snug text-subtle-foreground">
            Introduction to Cryptography (CYS533). Üsküdar University, Institute of Science.
          </p>
        </div>

        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-muted-surface px-2.5 py-1.5 text-xs font-medium text-link transition-colors duration-200 hover:border-primary/50 hover:text-link-hover"
          aria-label="View MixEncryption on GitHub"
        >
          <Github className="size-3.5 shrink-0" aria-hidden />
          GitHub
        </a>
      </div>

      <div className="border-t border-border px-3 py-2 text-center text-[11px] text-subtle-foreground sm:px-4">
        © {year} MixEncryption
      </div>
    </footer>
  );
}
