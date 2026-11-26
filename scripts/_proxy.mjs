// Node 22 só usa HTTPS_PROXY no fetch com NODE_USE_ENV_PROXY=1. Reexecuta o script com ele ligado.
import {spawnSync} from 'node:child_process';
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, process.argv.slice(1), {stdio: 'inherit', env: {...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1'}});
  process.exit(r.status ?? 1);
}
