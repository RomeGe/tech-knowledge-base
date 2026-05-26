/**
 * Semantic layout components with proper ARIA roles and landmarks.
 */

export function Article({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <article className={className} {...props}>
      {children}
    </article>
  );
}

export function Section({
  children,
  className = "",
  title,
  ...props
}: React.HTMLAttributes<HTMLElement> & { title?: string }) {
  return (
    <section className={className} {...props}>
      {title && <h2 className="sr-only">{title}</h2>}
      {children}
    </section>
  );
}

export function Aside({
  children,
  className = "",
  label,
  ...props
}: React.HTMLAttributes<HTMLElement> & { label?: string }) {
  return (
    <aside className={className} aria-label={label} {...props}>
      {children}
    </aside>
  );
}

export function Nav({
  children,
  className = "",
  label,
  ...props
}: React.HTMLAttributes<HTMLElement> & { label?: string }) {
  return (
    <nav className={className} aria-label={label} {...props}>
      {children}
    </nav>
  );
}

export function Main({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main id="main-content" className={className} role="main" {...props}>
      {children}
    </main>
  );
}
