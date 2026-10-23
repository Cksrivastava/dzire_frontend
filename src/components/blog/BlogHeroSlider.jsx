import React from "react";

const BlogHeroSlider = ({
  featuredPosts,
  currentSlide,
  setCurrentSlide,
  onOpenBlog,
}) => {
  return (
    <section className="blog-hero-slider">
      <div
        className="blog-hero-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {featuredPosts.map((post) => (
          <div
            className="blog-hero-slide"
            key={post.id}
            style={{ backgroundImage: `url(${post.image})` }}
          >
            <div className="blog-hero-overlay">
              <div className="blog-hero-content-inner">
                <span className="blog-featured-tag">Featured Blog</span>
                <h1>{post.title}</h1>
                <p>{post.excerpt}</p>

                <button
                  className="blog-main-readmore"
                  onClick={() => onOpenBlog(post.slug)}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="blog-dots">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            className={`blog-dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default BlogHeroSlider;
