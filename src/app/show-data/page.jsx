"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Calendar,
  User,
  Trash2,
  Eye,
  Heart,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

export default function PostedArticles() {
  const [postedData, setPostedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPostedData();
  }, []);

  const fetchPostedData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        "https://ireed-articles-service.vercel.app/v1/articles?pageNumber=0&size=15",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Failed to fetch posted data");
      const data = await res.json();

      if (Array.isArray(data)) setPostedData(data);
      else if (data.articles) setPostedData(data.articles);
      else if (data.data) setPostedData(data.data);
      else if (data.content) setPostedData(data.content);
      else setPostedData([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(
        `https://ireed-articles-service.vercel.app/v1/articles/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to delete article");
      setPostedData((prev) => prev.filter((a) => a._id !== id));
      alert("Article deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/assets/image/placeholder.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `https://ireed-articles-service.vercel.app/image/${path}`;
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "No content available.";
    const cleanText = text.replace(/<[^>]*>/g, "");
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  const getReadingTime = (text) => {
    // if (!text) return "1 min read";
    const cleanText = text.replace(/<[^>]*>/g, "");
    const words = cleanText.split(" ").length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    return `${readingTime} min read`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12 lg:py-20">
        {/* Container with responsive padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">
                  Live Articles
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Your Posted
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Articles
              </span>
            </h1>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover, manage, and share your published content with the world
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 lg:py-32">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Loading Articles
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch your content...
                </p>
              </div>
            </div>
          ) : error ? (
            // Enhanced Error State
            <div className="text-center py-16 lg:py-24">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={fetchPostedData}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-red-300 shadow-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : postedData.length > 0 ? (
            // Enhanced Articles Grid
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
              {postedData.map((post, index) => (
                <article
                  key={post._id || index}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col transform"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <Link
                      href={`/show-data/${post._id}`}
                      target="_blank"
                      className="block relative w-full h-48 sm:h-56 lg:h-64"
                    >
                      <Image
                        src={getImageUrl(post.uploadPhoto)}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      {/* Multi-layered overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 "></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 "></div>

                      {/* Article number badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        Article {index + 1}
                      </div>

                      {/* Enhanced view indicator */}
                      {/* <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-700 px-3 py-1.5 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 shadow-lg border border-gray-200">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-medium">View Article</span>
                        <ExternalLink className="w-3 h-3" />
                      </div> */}

                      {/* Reading time badge */}
                      {/* <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getReadingTime(post.summary || post.articleContent)}</span>
                      </div> */}
                    </Link>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <Link
                      href={`/show-data/${post._id}`}
                      target="_blank"
                      className="block text-xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight group-hover:text-blue-600"
                    >
                      {post.title}
                    </Link>

                    {/* Enhanced Meta information */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full border border-blue-100">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-800">
                          {post.name || "Anonymous"}
                        </span>
                      </div>
                      
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 rounded-full border border-purple-100">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-xs font-medium text-purple-800">
                            {dayjs(post.publishedDate).format("MMM D, YYYY")}
                          </span>
                        </div>
                      
                    </div>

                    {/* Enhanced Content preview */}
                    <div className="flex-1 mb-6">
                      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {truncateText(post.summary || post.articleContent)}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Action buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Link
                        href={`/show-data/${post._id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Read More</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* <div className="flex items-center gap-2">
                        <button
                          className="p-2.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Like Article"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteArticle(post._id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div> */}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // Enhanced Empty State
            <div className="text-center py-20 lg:py-32">
              <div className="max-w-lg mx-auto">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No Articles Yet!
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your article collection is empty. Ready to share your thoughts
                  with the world? Create your first masterpiece!
                </p>

                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg">
                  Create Your First Article
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
