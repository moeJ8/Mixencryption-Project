const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  let limit = Number.parseInt(query.limit, 10) || DEFAULT_LIMIT;
  limit = Math.min(MAX_LIMIT, Math.max(1, limit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { parsePagination, DEFAULT_LIMIT, MAX_LIMIT };
