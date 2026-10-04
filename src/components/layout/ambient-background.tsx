export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 ambient-glass-background">
      <span className="glass-backdrop-orb glass-backdrop-orb-one" />
      <span className="glass-backdrop-orb glass-backdrop-orb-two" />
      <span className="glass-backdrop-ribbon" />
    </div>
  );
}
