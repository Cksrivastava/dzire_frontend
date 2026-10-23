import React from "react";
import { RotateCcw } from "lucide-react";

const OrderItemsCard = ({
  items,
  orderStatus,
  hasReturnedItems,
  firstReturnRecord,
  returnedItemsMap,
  deliveryDate,
  onReturnItemsClick,
}) => {
  return (
    <div className="dz-order-items-card">
      <div className="order-items-top-bar">
        <h2 className="card-heading margin-0">
          Order Items ({items.length})
        </h2>
        {orderStatus === "Delivered" && (
          <button
            type="button"
            className="btn-return-items-header"
            onClick={onReturnItemsClick}
          >
            <RotateCcw size={16} />
            <span>{hasReturnedItems ? "View Return Details" : "Return Items"}</span>
          </button>
        )}
      </div>
      <p className="return-subnote">
        You can select one or more items to return.
      </p>

      <div className="items-list-group">
        {items.map((item) => {
          const returnInfo = returnedItemsMap[item.id];
          return (
            <div key={item.id} className="order-item-single-row">
              <div className="item-img-thumb">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-info-col">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-spec">{item.spec}</p>
                <span className="item-qty-price">
                  ₹{item.price.toLocaleString("en-IN")} &nbsp;×&nbsp; {item.quantity}
                </span>

                <div className="item-badge-row">
                  <span className="item-delivered-tag">
                    Delivered on {deliveryDate}
                  </span>
                  {returnInfo && (
                    <span className="item-return-requested-tag">
                      <RotateCcw size={12} />
                      Return Requested ({returnInfo.reasonLabel})
                    </span>
                  )}
                </div>
              </div>
              <div className="item-total-col">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItemsCard;
