import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './BarcodeScanner.css';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "barcode-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: []
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        onScan(decodedText);
        html5QrcodeScanner.clear();
      },
      (error) => {
        console.warn(error);
      }
    );

    setScanner(html5QrcodeScanner);

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error(err));
      }
    };
  }, []);

  return (
    <div className="barcode-scanner-modal">
      <div className="scanner-container">
        <div className="scanner-header">
          <h3>Scan Barcode Produk</h3>
          <button className="btn-close-scanner" onClick={onClose}>×</button>
        </div>
        <div id="barcode-reader"></div>
        <div className="scanner-footer">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
