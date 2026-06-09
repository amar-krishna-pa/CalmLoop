export default function FooterSection() {
  return (
    <footer className="border-t border-subtle bg-surface/10 py-12 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 px-6 text-xs text-muted">
        <div>
          <p className="font-bold text-sm text-primary mb-1">CalmLoop</p>
          <p>© 2026 CalmLoop. Grounded in ERP & ACT principles.</p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Support Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
