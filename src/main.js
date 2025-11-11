import { invoke, isTauri } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { isEnabled as isAutostartEnabled, enable as enableAutostart, disable as disableAutostart } from '@tauri-apps/plugin-autostart';

let savedCaPath = null;

async function safeInvoke(cmd, args) {
  // avoid calling invoke when not running inside Tauri (e.g. opened the page in a browser)
  try {
    if (!isTauri()) {
      throw new Error('Not running inside Tauri runtime');
    }
  } catch (e) {
    // isTauri() can throw in odd environments; double check globals
    if (!window.__TAURI_INTERNALS__) {
      return Promise.reject(new Error('Tauri runtime not available. Start the app with `cargo tauri dev` or run the built bundle.'));
    }
  }
  return invoke(cmd, args);
}

document.getElementById('saveCa').addEventListener('click', async () => {
  const input = document.getElementById('cafile');
  if (input.files.length === 0) {
    appendLog('请选择 CA 文件再上传');
    return;
  }
  const f = input.files[0];
  const name = f.name;
  const ab = await f.arrayBuffer();
  const data = Array.from(new Uint8Array(ab));
  appendLog('上传 CA...');
    try {
    const path = await safeInvoke('save_ca', { name, data });
    savedCaPath = path;
    appendLog('CA 已保存: ' + path);
  } catch (e) {
    appendLog('上传失败: ' + String(e));
  }
});

// load saved settings on startup
(async () => {
  try {
    const res = await invoke('load_settings');
    if (res) {
      // fill inputs
      document.getElementById('host').value = res.host || '';
      document.getElementById('port').value = res.port ? String(res.port) : '8883';
      document.getElementById('topic').value = res.topic || '';
      document.getElementById('user').value = res.username || '';
      document.getElementById('pass').value = res.password || '';
      // ca_path is not loaded into file input for security, just show path in log
      if (res.ca_path) appendLog('已加载 CA 路径: ' + res.ca_path);
    }
  } catch (e) {
    appendLog('读取设置失败: ' + String(e));
  }

  // init autostart checkbox
  try {
    const ok = await isAutostartEnabled();
    document.getElementById('autostart').checked = !!ok;
  } catch (e) {
    // ignore
  }
})();

document.getElementById('start').addEventListener('click', async () => {
  const host = document.getElementById('host').value;
  const port = parseInt(document.getElementById('port').value || '8883', 10);
  const topic = document.getElementById('topic').value;
  const user = document.getElementById('user').value || null;
  const pass = document.getElementById('pass').value || null;
  if (!host || !topic) { appendLog('host 和 topic 必填'); return; }
  const cfg = { host, port, topic, username: user, password: pass, ca_path: savedCaPath };
  appendLog('开始订阅...');
  try {
    // Tauri command signature expects a `cfg` key (see backend signature)
    await safeInvoke('start_subscribe', { cfg });
    // persist settings
    try { await invoke('save_settings', { cfg }); appendLog('设置已保存'); } catch (e) { appendLog('保存设置失败: ' + String(e)); }
    appendLog('已启动订阅');
  } catch (e) {
    appendLog('启动失败: ' + String(e));
  }
});

document.getElementById('stop').addEventListener('click', async () => {
  try {
    await safeInvoke('stop_subscribe');
    appendLog('已停止订阅');
  } catch (e) {
    appendLog('停止失败: ' + String(e));
  }
});

// autostart toggle handling
document.getElementById('autostart').addEventListener('change', async (e) => {
  const checked = e.target.checked;
  try {
    if (checked) await enableAutostart(); else await disableAutostart();
    appendLog('开机自启 ' + (checked ? '已启用' : '已禁用'));
  } catch (err) {
    appendLog('设置开机自启失败: ' + String(err));
    // revert checkbox
    try { const ok = await isAutostartEnabled(); document.getElementById('autostart').checked = !!ok; } catch {}
  }
});

function appendLog(s) {
  const log = document.getElementById('log');
  const p = document.createElement('div');
  p.textContent = '[' + new Date().toLocaleTimeString() + '] ' + s;
  log.prepend(p);
}

if (isTauri() || window.__TAURI_INTERNALS__) {
  listen('mqtt-message', event => {
    const payload = event.payload;
    appendLog('消息: ' + payload.topic + ' -> ' + payload.payload);
    // native notifications are handled by the Rust backend (winrt-notification) when running inside Tauri.
    // here we provide a browser fallback for dev without the Tauri runtime.
    (async () => {
      try {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(`MQTT: ${payload.topic}`, { body: payload.payload });
          } else if (Notification.permission !== 'denied') {
            const p = await Notification.requestPermission();
            if (p === 'granted') new Notification(`MQTT: ${payload.topic}`, { body: payload.payload });
          }
        }
      } catch (e) {
        appendLog('通知失败: ' + String(e));
      }
    })();
  }).catch(e => appendLog('监听 mqtt-message 失败: ' + String(e)));

  listen('mqtt-status', event => {
    appendLog('状态: ' + JSON.stringify(event.payload));
  }).catch(e => appendLog('监听 mqtt-status 失败: ' + String(e)));
} else {
  appendLog('非 Tauri 环境：事件监听未注册。请通过 `pnpm run tauri:dev` 或运行打包后的应用来启用后端功能。');
}
