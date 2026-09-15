import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  UserCheck,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginAdmin } = useData();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAdminId('');
      setPassword('');
      setErrorMessage(null);
      setIsShaking(false);
      setShowPassword(false);
      setAttempts(0);
      setIsSubmitting(false);
      setTimeout(() => idInputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await loginAdmin(adminId, password);
      if (success) {
        setErrorMessage(null);
        setIsShaking(false);
        onSuccess();
        onClose();
        return;
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setErrorMessage(
        'Authentication Warning: Invalid Admin ID or Password. Access denied to Engineering Administration Console.'
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
      passwordInputRef.current?.focus();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không kết nối được máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="admin-login-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        id="admin-login-dialog"
        className={`relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-bubble-lg border border-[#e5e9ee] transition-all ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <button
          id="admin-login-close-btn"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Restricted Engineering Console
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center shadow-bubble-inset">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#00356a] tracking-tight">Admin Login</h2>
            <p className="text-xs text-[#00356a]/60">Sign in with administrative credentials to continue.</p>
          </div>
        </div>

        {errorMessage && (
          <div
            id="admin-login-warning-alert"
            role="alert"
            className="mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300/80 text-rose-900 shadow-sm flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200"
          >
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-extrabold text-rose-950 flex items-center gap-1.5">
                <span>Access Denied</span>
                {attempts > 1 && (
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded-full font-bold">
                    Attempt #{attempts}
                  </span>
                )}
              </div>
              <p className="text-rose-800 leading-relaxed font-medium">{errorMessage}</p>
              <div className="text-[11px] text-rose-700/90 font-semibold pt-0.5">
                Please verify your Admin ID and password configured on the server.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="admin-login-id" className="block text-[11px] font-bold uppercase tracking-wider text-[#00356a] mb-1.5">
              Admin ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00356a]/40">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                ref={idInputRef}
                id="admin-login-id"
                type="text"
                required
                autoComplete="username"
                value={adminId}
                disabled={isSubmitting}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter admin ID"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold text-[#00356a] bg-[#f4f6f8] border transition-all focus:outline-none focus:ring-2 disabled:opacity-60 ${
                  errorMessage ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400' : 'border-[#dce0e6] shadow-bubble-inset focus:ring-[#00356a] focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="admin-login-password" className="block text-[11px] font-bold uppercase tracking-wider text-[#00356a]">Password</label>
              <span className="text-[10px] text-[#00356a]/50 font-medium">Case-sensitive</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00356a]/40">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={passwordInputRef}
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter password"
                className={`w-full pl-10 pr-11 py-3 rounded-2xl text-xs font-semibold text-[#00356a] bg-[#f4f6f8] border transition-all focus:outline-none focus:ring-2 disabled:opacity-60 ${
                  errorMessage ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400' : 'border-[#dce0e6] shadow-bubble-inset focus:ring-[#00356a] focus:bg-white'
                }`}
              />
              <button
                type="button"
                id="admin-login-toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#00356a]/40 hover:text-[#00356a] transition-colors cursor-pointer disabled:opacity-50"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              id="admin-login-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#00356a]/70 hover:text-[#00356a] hover:bg-[#f4f6f8] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="admin-login-submit-btn"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002850] active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Log In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#f0f3f5] flex items-center justify-between text-[10px] text-[#00356a]/50">
          <span>Authorized Civil Engineering Staff Only</span>
          <span>Server-secured session</span>
        </div>
      </div>
    </div>
  );
};
