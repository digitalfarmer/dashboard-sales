import { createClient } from '@clickhouse/client';

export const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST || 'http://192.168.21.31:8123',
  username: process.env.CLICKHOUSE_USER || 'admindb',
  password: process.env.CLICKHOUSE_PASSWORD || 'bsp123',
  database: 'dbw_bsp_konsolidasi',
});