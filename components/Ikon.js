export function IkonTas({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M5.5 8.5h13l-1 11.3a1.4 1.4 0 0 1-1.4 1.2H7.9a1.4 1.4 0 0 1-1.4-1.2L5.5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IkonMeteran({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle cx="9.5" cy="12" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9.5" cy="12" r="1.6" fill="currentColor" />
      <path d="M9.5 18.2H21v-3.4h-6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M17.5 18.2v-1.6M19.6 18.2v-1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
