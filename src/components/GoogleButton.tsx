"use client";

export default function GoogleButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
    >
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.9 5.5 29.2 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.9 5.5 29.2 3.5 24 3.5c-7.5 0-14 4.2-17.7 11.2z"
        />
        <path
          fill="#4CAF50"
          d="M24 44.5c5.1 0 9.8-1.9 13.3-5.1l-6.2-5.1c-2 1.4-4.5 2.2-7.1 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.9 40.2 16.4 44.5 24 44.5z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.2 5.1C41.1 35.8 44.5 30.4 44.5 24c0-1.2-.1-2.4-.3-3.5z"
        />
      </svg>
      {label}
    </button>
  );
}
