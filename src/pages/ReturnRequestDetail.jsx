import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ReturnRequestDetail.css';
import { AlertTriangle, Info } from 'lucide-react';

const ReturnRequestDetail = () => {
  const { id } = useParams();
  const [selectedItems, setSelectedItems] = useState({
    item1: false,
    item2: false
  });
  const [isDefective, setIsDefective] = useState(false);

  const toggleItem = (item) => {
    setSelectedItems({
      ...selectedItems,
      [item]: !selectedItems[item]
    });
  };

  return (
    <>
      <Navbar />
      <div className="return-request-container">
        <div className="return-header">
          <NavLink to="/account/orders" style={{ color: '#667085', textDecoration: 'none', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}>
            ← Back to Orders
          </NavLink>
          <h1>Request a Return</h1>
          <p>Order #{id || 'DZ-10045'} • Delivered on Oct 27, 2026</p>
        </div>

        <div className="return-section">
          <h2 className="return-section-title">Step 1: Select Items to Return</h2>
          <div className="return-product-list">
            
            {/* Product 1 */}
            <div>
              <label className="return-product-item" style={{ borderColor: selectedItems.item1 ? '#ff6600' : '#e5e7eb', backgroundColor: selectedItems.item1 ? '#fffaf7' : '#fafafa' }}>
                <input 
                  type="checkbox" 
                  className="return-checkbox" 
                  checked={selectedItems.item1}
                  onChange={() => toggleItem('item1')}
                />
                <div className="return-product-img"></div>
                <div className="return-product-info">
                  <h4>Premium Hiking Backpack (45L)</h4>
                  <p>Color: Orange / Blue | Qty: 1</p>
                </div>
                <div style={{ fontWeight: '600' }}>₹4,999</div>
              </label>

              {selectedItems.item1 && (
                <div className="return-reason-box">
                  <div className="return-form-group">
                    <label>Reason for Return</label>
                    <select>
                      <option value="">Select a reason...</option>
                      <option value="size">Wrong size or fit</option>
                      <option value="quality">Quality not as expected</option>
                      <option value="defective">Item is defective or damaged</option>
                      <option value="wrong_item">Received wrong item</option>
                      <option value="mind_changed">Changed my mind</option>
                    </select>
                  </div>
                  
                  <label className="return-defective-check">
                    <input type="checkbox" checked={isDefective} onChange={(e) => setIsDefective(e.target.checked)} style={{ accentColor: '#f04438' }} />
                    <AlertTriangle size={16} />
                    This item is defective/damaged. (Requires photo upload)
                  </label>

                  {isDefective && (
                    <div className="return-form-group">
                      <label>Upload Photo</label>
                      <input type="file" style={{ padding: '8px', border: '1px dashed #d1d5db', background: '#f9fafb' }} />
                    </div>
                  )}

                  <div className="return-form-group" style={{ marginBottom: 0 }}>
                    <label>Additional Comments (Optional)</label>
                    <textarea rows="2" placeholder="Please provide more details..."></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Product 2 */}
            <div>
              <label className="return-product-item" style={{ borderColor: selectedItems.item2 ? '#ff6600' : '#e5e7eb', backgroundColor: selectedItems.item2 ? '#fffaf7' : '#fafafa' }}>
                <input 
                  type="checkbox" 
                  className="return-checkbox" 
                  checked={selectedItems.item2}
                  onChange={() => toggleItem('item2')}
                />
                <div className="return-product-img"></div>
                <div className="return-product-info">
                  <h4>Camping Headlamp LED</h4>
                  <p>Qty: 1</p>
                </div>
                <div style={{ fontWeight: '600' }}>₹1,299</div>
              </label>
            </div>

          </div>
        </div>

        {/* Step 2 Only visible if at least one item is selected */}
        {(selectedItems.item1 || selectedItems.item2) && (
          <div className="return-section">
            <h2 className="return-section-title">Step 2: Choose Refund Method</h2>
            
            <div className="refund-method-options">
              <label className="refund-option">
                <input type="radio" name="refund" defaultChecked />
                <div className="refund-option-text">
                  <h4>Dzire Store Wallet (Recommended)</h4>
                  <p>Instant refund to your store wallet. Use it for your next purchase without waiting 5-7 bank days.</p>
                </div>
              </label>

              <label className="refund-option">
                <input type="radio" name="refund" />
                <div className="refund-option-text">
                  <h4>Original Payment Method</h4>
                  <p>Refund to your Bank Account/Credit Card. Takes 5-7 business days to reflect.</p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Info size={20} color="#667085" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#667085', lineHeight: '1.5' }}>
                <strong>Return Policy:</strong> You will be notified via email once your return request is approved. Our delivery partner will pick up the item within 2-3 working days. Ensure tags are intact.
              </p>
            </div>

            <div className="return-actions">
              <NavLink to="/account/orders" className="btn-cancel">Cancel</NavLink>
              <button className="btn-submit" onClick={() => alert('Return Request Submitted successfully!')}>Submit Request</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReturnRequestDetail;
