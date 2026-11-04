// Only the binding surface used by this application; Wrangler supplies it at runtime.
declare module 'cloudflare:workers' {
  export const env: import('./lib/server/contact').ContactEnvironment;
}
