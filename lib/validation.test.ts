import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBlogInput } from './validation.ts';

test('trims whitespace and returns clean input', () => {
  assert.deepEqual(validateBlogInput({ title: '  Hello  ', body: '  World  ' }), {
    title: 'Hello',
    body: 'World',
  });
});

test('throws when title is empty or whitespace', () => {
  assert.throws(() => validateBlogInput({ title: '   ', body: 'x' }), /required/);
});

test('throws when body is missing', () => {
  assert.throws(() => validateBlogInput({ title: 'x', body: '' }), /required/);
});

test('throws when title exceeds the max length', () => {
  assert.throws(
    () => validateBlogInput({ title: 'a'.repeat(81), body: 'x' }),
    /80/
  );
});

test('accepts a title exactly at the max length', () => {
  const title = 'a'.repeat(80);
  assert.equal(validateBlogInput({ title, body: 'x' }).title, title);
});
