// src/lib/pivot-service.ts

export async function getPivotData(filters: { branch: string; category: string; year: string }) {
  const { branch, category, year } = filters;
  let whereConditions = [`fkyear = ${year}`];

  // Logic untuk MULTI-BRANCH
  if (branch && branch !== 'ALL') {
    const branchList = branch.split(',').map(b => `'${b}'`).join(',');
    whereConditions.push(`kode_cabang IN (${branchList})`);
  }

  // Logic untuk MULTI-CATEGORY
  if (category && category !== 'ALL') {
    const catList = category.split(',').map(c => `'${c}'`).join(',');
    whereConditions.push(`kode_principal IN (${catList})`);
  }

  const whereClause = whereConditions.join(' AND ');
  // ... sisa query
}