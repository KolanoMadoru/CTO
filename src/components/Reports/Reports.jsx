import React, { useState, useEffect } from 'react';
import { salesDB, productDB } from '../../utils/indexedDB';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import { format } from 'date-fns';
import '../Products/ProductList.css';

const Reports = () => {
  const { formatCurrency } = useApp();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sales, setSales] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const allSales = await salesDB.getAll();
    const filteredSales = allSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= start && saleDate <= end;
    });

    setSales(filteredSales);

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSales.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    const productSales = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantitySold: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantitySold += item.quantity;
        productSales[item.productId].revenue += item.subtotal;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    setReportData({
      totalSales,
      totalTransactions,
      averageTransaction,
      topProducts,
    });
  };

  const exportToCSV = () => {
    if (!reportData) return;

    let csv = 'Laporan Penjualan\n';
    csv += `Periode: ${startDate} sampai ${endDate}\n\n`;
    csv += `Total Penjualan,${reportData.totalSales}\n`;
    csv += `Total Transaksi,${reportData.totalTransactions}\n`;
    csv += `Rata-rata Transaksi,${reportData.averageTransaction}\n\n`;
    csv += 'Produk Terlaris\n';
    csv += 'Nama Produk,Qty Terjual,Revenue\n';
    
    reportData.topProducts.forEach(product => {
      csv += `${product.productName},${product.quantitySold},${product.revenue}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${startDate}-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="product-list-container">
      <h2>{t('reports.title')}</h2>

      <div className="form-container" style={{ marginBottom: '24px' }}>
        <div className="form-grid">
          <div className="form-group">
            <label>{t('reports.startDate')}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>{t('reports.endDate')}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={generateReport} className="btn-primary">
              {t('reports.generate')}
            </button>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={exportToCSV} className="btn-secondary">
              {t('reports.export')}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{t('reports.totalSales')}</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#667eea' }}>
                {formatCurrency(reportData.totalSales)}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{t('reports.totalTransactions')}</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#4CAF50' }}>
                {reportData.totalTransactions}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{t('reports.averageTransaction')}</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#FF9800' }}>
                {formatCurrency(reportData.averageTransaction)}
              </div>
            </div>
          </div>

          <h3>{t('reports.topProducts')}</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Qty Terjual</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topProducts.map(product => (
                  <tr key={product.productId}>
                    <td>{product.productName}</td>
                    <td>{product.quantitySold}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
