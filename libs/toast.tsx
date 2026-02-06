'use client';

import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SuccessIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#40A5FF" />
      <path
        d="M8.5 14.5L12 18L19.5 10.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#FBE0E2" />
      <rect x="12.5" y="7" width="3" height="10" rx="1.5" fill="#ED1728" />
      <circle cx="14" cy="20.5" r="1.75" fill="#ED1728" />
    </svg>
  );
}

function ToastContent({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3.5 bg-primary-400 pl-4 pr-4.5 py-3 shadow-toast backdrop-blur-sm">
      <div className="shrink-0">{icon}</div>
      <p className="text-toast text-primary-20">{message}</p>
    </div>
  );
}

export const showToast = {
  success: (message: string) =>
    toast(<ToastContent icon={<SuccessIcon />} message={message} />),
  error: (message: string) =>
    toast(<ToastContent icon={<ErrorIcon />} message={message} />),
};

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      transition={Slide}
    />
  );
}
