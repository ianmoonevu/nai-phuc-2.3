import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { createPageTracker, normalizeGa4Id } from '../lib/analytics';

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };

export function Analytics() {
  const { branding, isAdminAuthenticated } = useData();
  const id = normalizeGa4Id(branding.ga4MeasurementId);
  useEffect(() => {
    if (!id) return;
    const w = window as unknown as AnalyticsWindow;
    const disabled = branding.ga4Enabled !== true || isAdminAuthenticated;
    w[`ga-disable-${id}`] = disabled;
    if (disabled) return;
    w.dataLayer ||= [];
    w.gtag ||= function () { w.dataLayer!.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', id, { send_page_view: false, allow_google_signals: false });
    const scriptId = `hoki-ga4-${id}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    }
    const track = createPageTracker((location, referrer) => w.gtag!('event', 'page_view', {
      send_to: id, page_location: location, page_referrer: referrer, page_title: document.title,
    }));
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const admin = /^\/admin(?:\/|$)/i.test(window.location.pathname);
        w[`ga-disable-${id}`] = admin;
        if (!admin) track(window.location.href);
      }, 100);
    };
    const push = history.pushState;
    const replace = history.replaceState;
    const wrappedPush: History['pushState'] = function (...args) { push.apply(history, args); schedule(); };
    const wrappedReplace: History['replaceState'] = function (...args) { replace.apply(history, args); schedule(); };
    history.pushState = wrappedPush; history.replaceState = wrappedReplace;
    window.addEventListener('popstate', schedule);
    schedule();
    return () => {
      clearTimeout(timer); w[`ga-disable-${id}`] = true;
      window.removeEventListener('popstate', schedule);
      if (history.pushState === wrappedPush) history.pushState = push;
      if (history.replaceState === wrappedReplace) history.replaceState = replace;
    };
  }, [id, branding.ga4Enabled, isAdminAuthenticated]);
  return null;
}
