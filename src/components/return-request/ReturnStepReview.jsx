import React from "react";
import { Pencil, X, Play } from "lucide-react";

const ReturnStepReview = ({
  selectedProducts,
  onEditStep,
  onRemovePhoto,
  onRemoveVideo,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="dz-return-step-content">
      <div className="dz-review-products-list">
        {selectedProducts.map((p) => (
          <div key={p.id} className="dz-review-product-card">
            <div className="review-card-top-row">
              <div className="review-item-img-thumb">
                <img src={p.image} alt={p.name} />
              </div>

              <div className="review-item-header-info">
                <div className="review-title-edit-row">
                  <h3 className="review-item-title">{p.name}</h3>
                  <button
                    type="button"
                    className="btn-edit-item"
                    onClick={onEditStep}
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="review-item-spec">
                  {p.spec} &nbsp;|&nbsp; Qty: {p.qty}
                </p>
              </div>
            </div>

            <div className="review-card-details-body">
              <div className="review-detail-block">
                <span className="detail-label">Reason for return</span>
                <span className="detail-val">{p.reason}</span>
              </div>

              {p.comments && (
                <div className="review-detail-block">
                  <span className="detail-label">Comments</span>
                  <span className="detail-val">{p.comments}</span>
                </div>
              )}

              {/* MEDIA PREVIEW GALLERY (PHOTOS + VIDEO) */}
              <div className="review-media-gallery-row">
                {p.photos &&
                  p.photos.map((photoUrl, pIdx) => (
                    <div key={pIdx} className="review-media-thumb">
                      <img src={photoUrl} alt={`Uploaded ${pIdx + 1}`} />
                      <button
                        type="button"
                        className="btn-remove-media-sm"
                        title="Remove photo"
                        onClick={() => onRemovePhoto(p.id, pIdx)}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}

                {p.video && (
                  <div className="review-media-thumb video-thumb">
                    <img src={p.video.thumb} alt="Uploaded video" />
                    <div className="play-overlay-sm">
                      <Play size={14} fill="#ffffff" color="#ffffff" />
                    </div>
                    <button
                      type="button"
                      className="btn-remove-media-sm"
                      title="Remove video"
                      onClick={() => onRemoveVideo(p.id)}
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="dz-return-actions-footer">
        <button
          type="button"
          className="btn-cancel-return"
          onClick={onBack}
        >
          Back
        </button>

        <button
          type="button"
          className="btn-continue-return"
          onClick={onSubmit}
        >
          Submit Return Request
        </button>
      </div>
    </div>
  );
};

export default ReturnStepReview;
