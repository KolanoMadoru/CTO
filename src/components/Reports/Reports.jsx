import React, { useState, useEffect } from 'react';
import { salesDB, productDB } from '../../utils/indexedDB';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../Products/ProductList.css';

const Reports = () => {
  const { formatCurrency } = useApp();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sales, setSales] = useState([]);
  const [reportData, setReportData] = useState(null);
  
  const COLORS = ['#667eea', '#4CAF50', '#FF9800', '#f44336', '#9C27B0', '#00BCD4', '#FFC107', '#E91E63', '#3F51B5', '#8BC34A'];

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

    const dailySalesMap = {};
    const dateRange = eachDayOfInterval({ start, end });
    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      dailySalesMap[dateKey] = { date: format(date, 'dd MMM'), sales: 0, transactions: 0 };
    });

    filteredSales.forEach(sale => {
      const dateKey = format(new Date(sale.date), 'yyyy-MM-dd');
      if (dailySalesMap[dateKey]) {
        dailySalesMap[dateKey].sales += sale.total;
        dailySalesMap[dateKey].transactions += 1;
      }
    });

    const dailySales = Object.values(dailySalesMap);

    const paymentMethodData = {};
    filteredSales.forEach(sale => {
      const method = sale.paymentMethod || 'cash';
      if (!paymentMethodData[method]) {
        paymentMethodData[method] = { name: method, value: 0 };
      }
      paymentMethodData[method].value += sale.total;
    });

    const paymentMethods = Object.values(paymentMethodData);

    setReportData({
      totalSales,
      totalTransactions,
      averageTransaction,
      topProducts,
      dailySales,
      paymentMethods,
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Trend Penjualan Harian</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#667eea" name="Penjualan" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Metode Pembayaran</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0 }}>{t('reports.topProducts')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.topProducts.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#667eea" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3>{t('reports.topProducts')} - Detail</h3>
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
