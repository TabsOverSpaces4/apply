import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Mounts the Vercel-style serverless handlers in `api/` as Vite middleware so
 * `npm run dev` works end-to-end without needing the Vercel CLI. Production
 * continues to use Vercel's real serverless runtime (no code changes needed).
 */
function apiRoutes(): Plugin {
  const ROUTES: Record<string, string> = {
    '/api/scrape': '/api/scrape.ts',
    '/api/fit-check': '/api/fit-check.ts',
    '/api/tailor': '/api/tailor.ts',
    '/api/networking': '/api/networking.ts',
    '/api/save-to-sheet': '/api/save-to-sheet.ts',
  };

  return {
    name: 'apply-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0];
        const modulePath = ROUTES[pathname];
        if (!modulePath) return next();

        try {
          const body = await readJsonBody(req);
          decorateRequest(req, body);
          const handler = await server.ssrLoadModule(modulePath);
          const fn = handler.default;
          if (typeof fn !== 'function') {
            throw new Error(`No default export in ${modulePath}`);
          }
          await fn(req, wrapResponse(res));
        } catch (err) {
          console.error(`[dev-api] ${pathname} failed:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: (err as Error).message }));
          }
        }
      });
    },
  };
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
    return undefined;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  if (chunks.length === 0) return undefined;
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function decorateRequest(req: IncomingMessage, body: unknown): void {
  (req as IncomingMessage & { body: unknown }).body = body;
  const url = new URL(req.url ?? '/', 'http://localhost');
  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    query[k] = v;
  });
  (req as IncomingMessage & { query: Record<string, string> }).query = query;
}

/**
 * Adds Vercel-style chainable helpers (res.status().json()) on top of
 * Node's ServerResponse so our handlers behave identically in dev and prod.
 */
function wrapResponse(res: ServerResponse): ServerResponse {
  const extended = res as ServerResponse & {
    status: (code: number) => typeof extended;
    json: (body: unknown) => typeof extended;
    send: (body: string | Buffer) => typeof extended;
  };

  extended.status = (code: number) => {
    res.statusCode = code;
    return extended;
  };
  extended.json = (body: unknown) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(body));
    return extended;
  };
  extended.send = (body: string | Buffer) => {
    res.end(body);
    return extended;
  };

  return extended;
}

export default defineConfig(({ mode }) => {
  // Load .env / .env.local (including non-VITE_ vars) into process.env so
  // the serverless handlers running in the Vite middleware can read keys
  // like ANTHROPIC_API_KEY and FIRECRAWL_API_KEY.
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    plugins: [react(), apiRoutes()],
  };
});
