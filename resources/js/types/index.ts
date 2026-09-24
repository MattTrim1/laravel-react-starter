import type { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Auth {
    user: User | null;
}

/**
 * Props shared with every page by App\Http\Middleware\HandleInertiaRequests.
 */
export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Omit<Config, 'location'> & { location: string };
    [key: string]: unknown;
}
