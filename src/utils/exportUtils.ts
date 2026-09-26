export const exportToCSV = (filename: string, headers: string[], data: any[][]) => {
  const processCell = (cell: any) => {
    if (cell === null || cell === undefined) return '""';
    const cellString = String(cell);
    if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
      return `"${cellString.replace(/"/g, '""')}"`;
    }
    return cellString;
  };

  const csvContent = [
    headers.map(processCell).join(','),
    ...data.map((row) => row.map(processCell).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF is BOM for UTF-8 Excel support
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
