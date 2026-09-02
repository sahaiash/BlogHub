import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePagination, totalPages } from './pagination.ts';

test('parsePagination defaults to page 1 with default limit', () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 9, offset: 0 });
});

test('parsePagination computes offset from page and limit', () => {
  assert.deepEqual(parsePagination({ page: '3', limit: '10' }), {
    page: 3,
    limit: 10,
    offset: 20,
  });
});

test('parsePagination clamps limit to maxLimit', () => {
  assert.equal(parsePagination({ limit: '999' }, { maxLimit: 50 }).limit, 50);
});

test('parsePagination rejects negative, zero and non-numeric pages', () => {
  assert.equal(parsePagination({ page: '-5' }).page, 1);
  assert.equal(parsePagination({ page: '0' }).page, 1);
  assert.equal(parsePagination({ page: 'abc' }).page, 1);
});

test('totalPages rounds up and is never below 1', () => {
  assert.equal(totalPages(0, 9), 1);
  assert.equal(totalPages(9, 9), 1);
  assert.equal(totalPages(10, 9), 2);
  assert.equal(totalPages(19, 9), 3);
});
