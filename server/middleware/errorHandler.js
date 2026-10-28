function errorHandler(err, _req, res, _next) {
  if (err.name === 'ZodError') {
    const first = err.issues?.[0];
    const message = first?.message || 'Invalid request.';
    return res.status(400).json({ message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      message: `An account with that ${field} already exists.`,
    });
  }

  console.error(err);
  return res.status(500).json({ message: 'Something went wrong.' });
}

module.exports = errorHandler;
