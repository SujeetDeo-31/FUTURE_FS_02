
import { redirect } from 'next/navigation';

/**
 * Root Landing Page
 * Redirects users to the dashboard. The middleware handles authentication
 * and will redirect unauthenticated users to /login.
 */
export default function HomePage() {
  redirect('/dashboard');
}
