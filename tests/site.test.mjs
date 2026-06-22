import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const robots = await readFile(new URL('../robots.txt', import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');

function check(name, assertion) {
  assertion();
  console.log(`✓ ${name}`);
}

check('keeps core contact conversion paths', () => {
  assert.match(html, /href="tel:5615740332"/);
  assert.match(html, /href="https:\/\/wa\.me\/15618266324/);
  assert.match(html, /action="https:\/\/formspree\.io\/f\/manpeanb"/);
});

check('links verified public business profiles', () => {
  assert.match(html, /https:\/\/maps\.app\.goo\.gl\/tDXaWrhd5MMVGSmo7/);
  assert.match(html, /https:\/\/www\.instagram\.com\/aj_loadandgo\//);
  assert.match(html, /61577593792104/);
});

check('requires the core fields and includes a honeypot', () => {
  assert.match(html, /name="name"[^>]*required/);
  assert.match(html, /name="phone"[^>]*required/);
  assert.match(html, /name="message"[^>]*required/);
  assert.match(html, /name="_gotcha"/);
});

check('provides validation and submission feedback', () => {
  assert.match(script, /function validatePhone/);
  assert.match(script, /function validateEmail/);
  assert.match(script, /Thank you! We will contact you shortly\./);
  assert.match(script, /Network error\. Please check your connection and try again\./);
});

check('does not publish unverifiable placeholder proof', () => {
  assert.doesNotMatch(html, /127\+|98%|Sarah Martinez|Michael Johnson|Linda Chen|Robert Thompson|Jessica Rivera|David Park/);
});

check('includes basic discoverability metadata', () => {
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.ajloadandgo\.com\/">/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:image"/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(robots, /Sitemap: https:\/\/www\.ajloadandgo\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.ajloadandgo\.com\/<\/loc>/);
});
