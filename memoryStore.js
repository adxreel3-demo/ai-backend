const sessions = new Map();

function getHistory(sessionId) {
  return sessions.get(sessionId) || [];
}

function saveHistory(sessionId, message, reply) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  sessions.get(sessionId).push({ message, reply });
}

module.exports = { getHistory, saveHistory };
