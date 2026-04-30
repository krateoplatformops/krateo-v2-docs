#!/usr/bin/env node
/**
 * set-last-version.js <version>
 *
 * Patches the `lastVersion` field inside the docs plugin configuration in
 * docusaurus.config.js so that the given version becomes the default one
 * visitors land on at docs.krateo.io.
 *
 * The script handles two common config shapes:
 *
 *   Shape A — flat preset config (most common in Docusaurus scaffolding):
 *     presets: [['classic', { docs: { lastVersion: '...' } }]]
 *
 *   Shape B — explicit plugin config:
 *     plugins: [['@docusaurus/plugin-content-docs', { lastVersion: '...' }]]
 *
 * If neither shape is found the script exits with a non-zero code so the
 * CI pipeline fails visibly rather than silently shipping the wrong default.
 *
 * Usage:
 *   node scripts/set-last-version.js 3.1.0
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/set-last-version.js <version>');
  process.exit(1);
}

const configPath = path.resolve(__dirname, '..', 'docusaurus.config.js');
if (!fs.existsSync(configPath)) {
  console.error(`docusaurus.config.js not found at ${configPath}`);
  process.exit(1);
}

let src = fs.readFileSync(configPath, 'utf8');
const original = src;

// ── Strategy 1: replace an existing lastVersion value ────────────────────────
// Matches:  lastVersion: 'anything'  or  lastVersion: "anything"
const existingPattern = /(lastVersion\s*:\s*)(['"`])([^'"`]*)(['"`])/;
if (existingPattern.test(src)) {
  src = src.replace(existingPattern, (_, key, q1, _old, q2) => {
    return `${key}${q1}${version}${q2}`;
  });
  console.log(`Updated existing lastVersion to '${version}'.`);
}

// ── Strategy 2: insert lastVersion into a docs: {} block ─────────────────────
// Targets the first `docs: {` block that does NOT already have lastVersion.
else if (/docs\s*:\s*\{/.test(src) && !src.includes('lastVersion')) {
  src = src.replace(/(docs\s*:\s*\{)/, `$1\n        lastVersion: '${version}',`);
  console.log(`Inserted lastVersion: '${version}' into docs: {} block.`);
}

// ── No suitable location found ────────────────────────────────────────────────
else {
  console.error(
    'Could not locate a docs plugin configuration block in docusaurus.config.js.\n' +
    'Please add a `lastVersion` placeholder inside your docs preset or plugin config:\n\n' +
    "  docs: { lastVersion: 'current' }\n"
  );
  process.exit(1);
}

if (src === original) {
  console.warn('Warning: file content unchanged — lastVersion may already be correct.');
}

fs.writeFileSync(configPath, src, 'utf8');
console.log(`docusaurus.config.js written successfully.`);