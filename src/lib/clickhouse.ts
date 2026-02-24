import { createClient } from '@clickhouse/client';

export const clickhouse = createClient({
   url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123', // Ganti 'host' jadi 'url'
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: 'dbw_bsp_konsolidasi',
});
