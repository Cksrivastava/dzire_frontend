import React from "react";
import { Info, Upload, Video, Play, X } from "lucide-react";
import { REASON_OPTIONS } from "../../data/returnRequestData";

const ReturnStepSelectItems = ({
  products,
  onToggleSelect,
  onUpdateField,
  onPhotoUpload,
  onRemovePhoto,
  onVideoUpload,
  onRemoveVideo,
  onCancel,
  onContinue,
}) => {
  return (
    <div className="dz-return-step-content">
      {/* BLUE INFO BANNER */}
      <div className="dz-info-banner">
        <div className="info-icon-circle">
          <Info size={18} />
        </div>
        <div className="info-text-wrap">
          <p className="info-title">
            Please provide a reason and upload photos & a video for each item
            you want to return.
          </p>
          <p className="info-desc">
            This helps us process your return quickly. Both photos and a video
            are mandatory.
          </p>
        </div>
      </div>

      {/* PRODUCT ITEMS CARDS */}
      <div className="dz-product-cards-list">
        {products.map((item) => (
          <div
            key={item.id}
            className={`dz-return-product-card ${
              item.selected ? "is-selected" : "not-selected"
            }`}
          >
            <div className="product-card-top-row">
              <label className="checkbox-custom-wrap">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => onToggleSelect(item.id)}
                  className="checkbox-custom-input"
                />
                <span className="checkbox-custom-box"></span>
              </label>

              <div className="product-thumb-box">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="product-info-column">
                <h3 className="product-title">{item.name}</h3>
                <p className="product-spec">{item.spec}</p>
                <div className="product-badge-qty-row">
                  {!item.selected && (
                    <span className="badge-not-selected">
                      🚫 Not selected for return
                    </span>
                  )}
                  <span className="product-qty-text">Qty: {item.qty}</span>
                </div>
              </div>
            </div>

            {/* EXPANDED FORM FOR SELECTED ITEM */}
            {item.selected && (
              <div className="product-return-form-body">
                {/* REASON & COMMENTS INPUTS GRID */}
                <div className="form-two-col-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Reason for return <span className="red-star">*</span>
                    </label>
                    <div className="select-input-wrapper">
                      <select
                        value={item.reason}
                        onChange={(e) =>
                          onUpdateField(item.id, "reason", e.target.value)
                        }
                        className="form-select-control"
                      >
                        {REASON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Additional comments{" "}
                      <span className="optional-tag">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Please provide any additional details..."
                      value={item.comments}
                      onChange={(e) =>
                        onUpdateField(item.id, "comments", e.target.value)
                      }
                      className="form-text-control"
                    />
                  </div>
                </div>

                {/* UPLOADS GRID: PHOTOS + VIDEO */}
                <div className="media-upload-two-col-grid">
                  {/* LEFT COLUMN: PHOTOS UPLOAD */}
                  <div className="media-col">
                    <label className="form-label">
                      Product Images <span className="red-star">*</span>{" "}
                      <span className="sub-req">(Min 3 photos)</span>
                    </label>
                    <div className="upload-section-wrap">
                      <label className="dz-upload-dropzone">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => onPhotoUpload(item.id, e)}
                          className="hidden-file-input"
                        />
                        <div className="upload-icon-circle">
                          <Upload size={22} />
                        </div>
                        <div className="upload-text-stack">
                          <strong className="upload-main-text">
                            Upload Photos
                          </strong>
                          <span className="upload-sub-text">
                            Add at least 3 clear images
                          </span>
                        </div>
                      </label>

                      {/* UPLOADED PHOTO THUMBNAILS HORIZONTAL ROW */}
                      {item.photos && item.photos.length > 0 && (
                        <div className="thumbnails-horizontal-row">
                          {item.photos.map((photoUrl, pIdx) => (
                            <div key={pIdx} className="media-thumb-card">
                              <img src={photoUrl} alt={`Product ${pIdx + 1}`} />
                              <button
                                type="button"
                                className="btn-remove-media"
                                title="Remove photo"
                                onClick={() => onRemovePhoto(item.id, pIdx)}
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: VIDEO UPLOAD */}
                  <div className="media-col">
                    <label className="form-label">
                      Product Video <span className="red-star">*</span>{" "}
                      <span className="sub-req">
                        (Upload video while opening the package)
                      </span>
                    </label>
                    <div className="upload-section-wrap">
                      <label className="dz-upload-dropzone">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => onVideoUpload(item.id, e)}
                          className="hidden-file-input"
                        />
                        <div className="upload-icon-circle">
                          <Video size={22} />
                        </div>
                        <div className="upload-text-stack">
                          <strong className="upload-main-text">
                            Upload Video
                          </strong>
                          <span className="upload-sub-text">
                            Package opening video (Max 100 MB, MP4/MOV)
                          </span>
                        </div>
                      </label>

                      {/* UPLOADED VIDEO THUMBNAIL CARD */}
                      {item.video && (
                        <div className="video-uploaded-preview-row">
                          <div className="video-thumb-preview">
                            <img src={item.video.thumb} alt="Video preview" />
                            <div className="play-icon-overlay">
                              <Play size={16} fill="#ffffff" color="#ffffff" />
                            </div>
                            <button
                              type="button"
                              className="btn-remove-media"
                              title="Remove video"
                              onClick={() => onRemoveVideo(item.id)}
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <div className="video-file-info">
                            <span className="v-filename">
                              {item.video.name}
                            </span>
                            <span className="v-filesize">
                              {item.video.size}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="dz-return-actions-footer">
        <button
          type="button"
          className="btn-cancel-return"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn-continue-return"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ReturnStepSelectItems;
