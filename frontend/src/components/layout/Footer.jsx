/**
 * src/components/layout/Footer.jsx
 * ---------------------------------
 * App footer rendered at the bottom of every page.
 * Content is fixed per spec — do not alter the four lines.
 */

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
        <span className="font-medium text-foreground">PawPal++ — Where AI insights meet pet care</span>
        <span>CodePath AI110 Final Project</span>
        <span>Created by Krish A. Patel alongside Claude Code in April 2026</span>
        <span>Powered by Google Gemini</span>
      </div>
    </footer>
  )
}
