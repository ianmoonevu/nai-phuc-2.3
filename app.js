// Compatible with Plesk's default app.js entry and Node's ESM loader.
import('./server.js').catch((error) => {
  console.error('HOKI startup failed:', error.message);
  process.exitCode = 1;
});
