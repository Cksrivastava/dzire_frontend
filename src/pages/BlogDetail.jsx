import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogDetailBody from "../components/blog/BlogDetailBody";
import BlogCommentsSection from "../components/blog/BlogCommentsSection";
import "./BlogDetail.css";
import { blogAPI } from "../services/api";
import wsClient from "../services/websocket";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments state with localStorage persistence
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadBlog = (skipCache = false) => {
    setLoading(true);
    blogAPI
      .getBySlug(slug)
      .then((res) => {
        const found = res?.blog || res?.post;
        if (found) {
          setPost(found);
          const storageKey = `blog_comments_${slug}`;
          const savedComments = localStorage.getItem(storageKey);
          if (savedComments) {
            try {
              setComments(JSON.parse(savedComments));
            } catch {
              setComments(found.comments || []);
            }
          } else {
            setComments(found.comments || []);
          }
        } else {
          setPost(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBlog(false);
    const unsub = wsClient.on("BLOGS_UPDATED", () => loadBlog(true));
    return () => {
      unsub();
    };
  }, [slug]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!commentText.trim()) {
      setErrorMsg("Please write a comment.");
      return;
    }

    setErrorMsg("");

    const newComment = {
      id: Date.now(),
      author: authorName.trim(),
      email: authorEmail.trim(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      text: commentText.trim(),
      likes: 0,
      userLiked: false,
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    if (post) {
      localStorage.setItem(`blog_comments_${slug}`, JSON.stringify(updatedComments));
    }

    blogAPI.addComment(slug, {
      author: newComment.author,
      email: newComment.email,
      text: newComment.text,
    }).catch((err) => {
      console.warn("Backend blog comment sync fallback:", err);
    });

    // Reset form
    setCommentText("");
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  const handleToggleLike = (commentId) => {
    const updatedComments = comments.map((c) => {
      if (c.id === commentId) {
        const userLiked = !c.userLiked;
        return {
          ...c,
          userLiked,
          likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      return c;
    });

    setComments(updatedComments);
    if (post) {
      localStorage.setItem(`blog_comments_${slug}`, JSON.stringify(updatedComments));
    }

    blogAPI.likeComment(slug, commentId).catch((err) => {
      console.warn("Backend blog comment like fallback:", err);
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading && !post) {
    return (
      <>
        <Navbar />
        <div className="blog-detail-page">
          <div className="blog-detail-container" style={{ padding: "80px 20px", textAlign: "center", minHeight: "50vh" }}>
            <p style={{ color: "#64748b", fontSize: "16px" }}>Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="blog-detail-page">
          <div className="blog-detail-container">
            <button className="blog-back-btn" onClick={() => navigate("/blog")}>
              ← Back
            </button>
            <h1>Blog not found</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <img src={post.image} alt={post.title} className="blog-detail-image" />

          <div className="blog-detail-content">
            <BlogDetailBody post={post} />

            <BlogCommentsSection
              comments={comments}
              authorName={authorName}
              setAuthorName={setAuthorName}
              authorEmail={authorEmail}
              setAuthorEmail={setAuthorEmail}
              commentText={commentText}
              setCommentText={setCommentText}
              onAddComment={handleAddComment}
              onToggleLike={handleToggleLike}
              getInitials={getInitials}
              successMsg={successMsg}
              errorMsg={errorMsg}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetail;