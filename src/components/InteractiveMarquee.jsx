import React from "react";

export const InteractiveMarquee = ({
  items,
  speed = 1,
  direction = "left",
  renderItem,
  containerRef: externalRef,
}) => {
  const localRef = React.useRef(null);
  const containerRef = externalRef || localRef;
  const [itemsPerView, setItemsPerView] = React.useState(4);

  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerView(2);
      } else if (width < 900) {
        setItemsPerView(2);
      } else if (width < 1300) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (direction === "right" && speed > 0) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    let isUserInteracting = false;
    let isHovered = false;
    let frameId;
    let timeoutId;

    const autoScroll = () => {
      if (!isUserInteracting && !isHovered && speed > 0) {
        const halfWidth = el.scrollWidth / 2;
        if (direction === "left") {
          el.scrollLeft += speed;
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          }
        } else {
          el.scrollLeft -= speed;
          if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
        }
      }
      if (speed > 0) {
        frameId = requestAnimationFrame(autoScroll);
      }
    };

    let isDragging = false;
    let startX;
    let scrollLeftStart;

    const handleMouseDown = (e) => {
      isDragging = true;
      isUserInteracting = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeftStart - walk;
    };

    const handleMouseUpOrLeave = () => {
      if (isDragging) {
        isDragging = false;
        el.style.cursor = 'grab';
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isUserInteracting = false;
      }, 2000);
    };

    const handleTouchStart = () => {
      isUserInteracting = true;
      clearTimeout(timeoutId);
    };

    const handleTouchEnd = () => {
      timeoutId = setTimeout(() => {
        isUserInteracting = false;
      }, 2000);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUpOrLeave);
    el.addEventListener('mouseleave', handleMouseUpOrLeave);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('wheel', handleTouchStart);

    if (speed > 0) {
      frameId = requestAnimationFrame(autoScroll);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUpOrLeave);
      el.removeEventListener('mouseleave', handleMouseUpOrLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('wheel', handleTouchStart);
    };
  }, [speed, direction, items]);

  const duplicatedItems = speed > 0 ? [...items, ...items] : items;

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        width: '100%',
        cursor: 'grab',
        display: 'flex',
        userSelect: 'none',
        scrollbarWidth: 'none',
        paddingTop: '10px',
        paddingBottom: '10px',
        marginTop: '-10px',
        marginBottom: '-10px',
        scrollSnapType: "x mandatory",
      }}
      className="marquee-container-interactive"
    >
      <div style={{ display: 'flex', gap: '10px', padding: '10px 0', width: '100%' }} className="marquee-track">
        {duplicatedItems.map((item, idx) => renderItem(item, idx, itemsPerView))}
      </div>
    </div>
  );
};

export default InteractiveMarquee;
