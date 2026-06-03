#!/usr/bin/env node
const http = require('http');
const { URL } = require('url');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--mac' && args[i+1]) { out.mac = args[++i]; continue; }
    if (a === '--name' && args[i+1]) { out.name = args[++i]; continue; }
    if (a === '--type' && args[i+1]) { out.type = args[++i]; continue; }
    if (a === '--server' && args[i+1]) { out.server = args[++i]; continue; }
    if (a === '--help') { out.help = true; }
  }
  return out;
}

const argv = parseArgs();
const SERVER = argv.server || 'http://localhost:3000';
const MAC = argv.mac || 'AA:BB:CC:DD:EE:01';
const NAME = argv.name || 'ESP32 Wokwi';
const TYPE = argv.type || 'multi_sensor';

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SERVER);
    const body = data ? JSON.stringify(data) : null;
    const opts = { method: method, hostname: url.hostname, port: url.port || 80, path: url.pathname + (url.search || ''), headers: {} };
    if (body) { opts.headers['Content-Type'] = 'application/json'; opts.headers['Content-Length'] = Buffer.byteLength(body); }
    const lib = url.protocol === 'https:' ? require('https') : http;
    const req = lib.request(opts, (res) => {
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        let parsed = null;
        try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = raw; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Server:', SERVER);
  console.log('MAC:', MAC);
  try {
    const urlGet = `/api/devices/by-mac/${encodeURIComponent(MAC)}`;
    const getRes = await request('GET', urlGet);
    if (getRes.status === 200) {
      console.log('Device already exists:', getRes.body);
      return;
    }
    if (getRes.status !== 404) {
      console.log('GET by-mac returned', getRes.status, getRes.body);
    }

    // create device
    const payload = { roomId: null, name: NAME, macAddress: MAC, type: TYPE };
    const createRes = await request('POST', '/api/devices', payload);
    if (createRes.status === 201) {
      console.log('Device created:', createRes.body);
    } else {
      console.error('Failed to create device:', createRes.status, createRes.body);
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (argv.help) {
  console.log('Usage: node register_sim_device.js [--server http://localhost:3000] [--mac AA:BB:CC:DD:EE:01] [--name "ESP32 Wokwi"] [--type multi_sensor]');
  process.exit(0);
}

main();
