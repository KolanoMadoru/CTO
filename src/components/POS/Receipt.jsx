import React from 'react';
import { t } from '../../locales/id';
import { useApp } from '../../contexts/AppContext';
import './Receipt.css';

const Receipt = ({ sale, settings, onClose }) => {
  const { formatCurrency } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-container">
        <div className="receipt-content" id="receipt-print">
          <div className="receipt-header">
            <h2>{settings.storeName || 'SomansaPOS'}</h2>
            <p>{settings.storeAddress}</p>
            <p>{settings.storePhone}</p>
            <hr />
          </div>

          <div className="receipt-info">
            <div className="receipt-row">
              <span>{t('receipt.date')}:</span>
              <span>{new Date(sale.date).toLocaleString('id-ID')}</span>
            </div>
            <div className="receipt-row">
              <span>{t('receipt.cashier')}:</span>
              <span>{sale.cashierName}</span>
            </div>
            <div className="receipt-row">
              <span>{t('receipt.customer')}:</span>
              <span>{sale.customerName}</span>
            </div>
            <div className="receipt-row">
              <span>No. Transaksi:</span>
              <span>{sale.id}</span>
            </div>
          </div>

          <hr />

          <table className="receipt-items">
            <thead>
              <tr>
                <th>{t('receipt.item')}</th>
                <th>{t('receipt.qty')}</th>
                <th>{t('receipt.price')}</th>
                <th>{t('receipt.total')}</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          <div className="receipt-totals">
            <div className="receipt-row">
              <span>{t('receipt.subtotal')}:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="receipt-row">
                <span>{t('receipt.discount')}:</span>
                <span>-{formatCurrency(sale.discountAmount)}</span>
              </div>
            )}
            <div className="receipt-row">
              <span>{t('receipt.tax')}:</span>
              <span>{formatCurrency(sale.taxAmount)}</span>
            </div>
            <div className="receipt-row grand-total">
              <strong>{t('receipt.grandTotal')}:</strong>
              <strong>{formatCurrency(sale.total)}</strong>
            </div>
          </div>

          <hr />

          <div className="receipt-payment">
            <div className="receipt-row">
              <span>{t('receipt.payment')}:</span>
              <span>{sale.paymentMethod.toUpperCase()}</span>
            </div>
            {sale.paymentMethod === 'cash' && (
              <>
                <div className="receipt-row">
                  <span>Dibayar:</span>
                  <span>{formatCurrency(sale.paidAmount)}</span>
                </div>
                <div className="receipt-row">
                  <span>{t('receipt.change')}:</span>
                  <span>{formatCurrency(sale.changeAmount)}</span>
                </div>
              </>
            )}
          </div>

          <div className="receipt-footer">
            <hr />
            <p>{settings.receiptFooter || 'Terima kasih atas kunjungan Anda!'}</p>
          </div>
        </div>

        <div className="receipt-actions no-print">
          <button className="btn-print" onClick={handlePrint}>
            {t('receipt.print')}
          </button>
          <button className="btn-close" onClick={onClose}>
            {t('receipt.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
