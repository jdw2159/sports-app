var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/nbadb';

module.exports = connectionString;