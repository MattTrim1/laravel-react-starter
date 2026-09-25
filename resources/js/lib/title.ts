const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Builds the document title for both the client and the SSR entry, so they never disagree.
 */
export function title(pageTitle: string): string {
    return pageTitle ? `${pageTitle} - ${appName}` : appName;
}
