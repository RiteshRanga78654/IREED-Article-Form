"use client";
import { useEffect, useState } from "react";
import {
  Loader2,
  Calendar,
  User,
  Trash2,
  Eye,
  Heart,
  ExternalLink,
  Clock,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

export default function PostedArticles() {
  const [postedData, setPostedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    fetchPostedData();
  }, []);

  useEffect(() => {
    const filtered = postedData.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [postedData, searchTerm]);

  const fetchPostedData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Starting API call...");

      const res = await fetch(
        "https://ireed-articles-service.vercel.app/v1/articles?pageNumber=0&size=15",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Add CORS mode if needed
          mode: "cors",
        }
      );

      console.log("📡 Response status:", res.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(
          `HTTP ${res.status}: ${res.statusText || "Failed to fetch data"}`
        );
      }

      const data = await res.json();
      console.log("📊 Raw API response:", data);
      console.log("📊 Data type:", typeof data);
      console.log("📊 Is array?", Array.isArray(data));

      let articles = [];

      if (Array.isArray(data)) {
        articles = data;
      } else if (data && typeof data === "object") {
        // Check various possible response structures
        if (data.articles && Array.isArray(data.articles)) {
          articles = data.articles;
        } else if (data.data && Array.isArray(data.data)) {
          articles = data.data;
        } else if (data.content && Array.isArray(data.content)) {
          articles = data.content;
        } else if (data.results && Array.isArray(data.results)) {
          articles = data.results;
        } else if (data.items && Array.isArray(data.items)) {
          articles = data.items;
        } else {
          console.log("📊 Available data keys:", Object.keys(data));
        }
      }

      console.log("✅ Final articles array:", articles);
      console.log("✅ Articles count:", articles.length);

      setPostedData(articles);
    } catch (err) {
      console.error("💥 Fetch error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    )
      return;

    try {
      setDeleteLoading(id);
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
      alert("Error deleting article: " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/api/placeholder/400/300";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `https://ireed-articles-service.vercel.app/image/${path}`;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "No content available.";
    const cleanText = text.replace(/<[^>]*>/g, "");
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  const getReadingTime = (text) => {
    if (!text) return "1 min read";
    const cleanText = text.replace(/<[^>]*>/g, "");
    const words = cleanText.split(" ").length;
    const readingTime = Math.ceil(words / 200);
    return `${readingTime} min read`;
  };

  const testConnection = async () => {
    console.log("🔍 Testing connection...");
    try {
      // Test basic connectivity first
      const testRes = await fetch("https://httpbin.org/json", { mode: "cors" });
      console.log("✅ Internet connection OK");

      // Test the API endpoint without parsing
      const apiTest = await fetch(
        "https://ireed-articles-service.vercel.app/v1/articles?pageNumber=0&size=1"
      );
      console.log("🌐 API endpoint response status:", apiTest.status);
      console.log("🌐 API endpoint accessible:", apiTest.ok);
    } catch (err) {
      console.error("❌ Connection test failed:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    const dateObj = new Date(date);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Live Articles
                </span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-[#2a3290] bg-clip-text text-transparent">
                Article Collection
              </span>
              {/* <br /> */}
              {/* <span className="bg-gradient-to-r from-blue-600 to-[#2a3290] bg-clip-text text-transparent">
              {""}Collection
              </span> */}
            </h1>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-16"></div>
              <BookOpen className="w-6 h-6 text-blue-500" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-16"></div>
            </div>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage, explore, and share your published content with the world
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Debug Panel */}
          {debugMode && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-xl mb-8 font-mono text-sm max-h-60 overflow-y-auto">
              <h4 className="text-white font-bold mb-2">
                🐛 Debug Information:
              </h4>
              <div>
                API URL:
                https://ireed-articles-service.vercel.app/v1/articles?pageNumber=0&size=15
              </div>
              <div>Loading: {loading.toString()}</div>
              <div>Error: {error || "None"}</div>
              <div>Raw Data Count: {postedData.length}</div>
              <div>Filtered Data Count: {filteredData.length}</div>
              <div>Search Term: '{searchTerm}'</div>
              <div className="mt-2 text-yellow-300">
                📝 Open browser DevTools Console for detailed API logs
              </div>
            </div>
          )}

          {/* Stats Bar */}
          {/* {!loading && !error && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100">
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Total Articles: <span className="font-bold text-gray-800">{postedData.length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Showing: <span className="font-bold text-gray-800">{filteredData.length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchPostedData}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                  <button 
                    onClick={testConnection}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <span className="text-sm font-medium">Test API</span>
                  </button>
                  <button 
                    onClick={() => setDebugMode(!debugMode)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <span className="text-sm font-medium">Debug</span>
                  </button>
                </div>
              </div>
            </div>
          )} */}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 lg:py-24">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Loading Articles
                </h3>
                <p className="text-gray-500">Fetching your latest content...</p>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-12 lg:py-20">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Something went wrong
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchPostedData}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-red-300 shadow-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            // Articles Grid
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredData.map((post, index) => (
                <article
                  key={post._id || index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-video w-full">
                      <img
                        src={getImageUrl(post.uploadPhoto)}
                        alt={post.title || "Article image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Overlay with gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Article number badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-[#2a3290] text-white px-2 py-1 text-xs font-bold rounded-lg shadow-lg">
                      #{index + 1}
                    </div>

                    {/* Reading time */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {getReadingTime(post.summary || post.articleContent)}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-[#2a3290] transition-colors duration-300">
                        Title : {post.title || "Untitled Article"}
                      </h3>

                      
                      {/* Author */}
                      {post.name && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                            <User className="w-3 h-3 text-blue-600" />
                            <span className="text-blue-800 font-bold">
                              Author : {post.name}
                            </span>
                          </div>
                        </div>
                      )}

                      

                      {/* Date and Category */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          {post.category && (
                            <span className="bg-blue-50 text-[#2a3290] px-2 py-1 rounded-lg font-medium">
                              Category : {post.category}
                            </span>
                          )}
                        </div>
                        <span className="flex">
                          <Calendar className="w-3 h-3" />

                          {formatDate(post.publishedDate || post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {truncateText(
                            post.summary || post.articleContent || post.content
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Additional Fields Display */}
                    <div className="space-y-2 mb-4 text-xs">
                      {post.tags && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* {post.status && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-lg font-medium ${
                              post.status === "published"
                                ? "bg-green-50 text-green-700"
                                : post.status === "draft"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {post.status}
                          </span>
                        </div>
                      )} */}

                      {post.views && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span>{post.views} views</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <a
                        href={`/show-data/${post._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-[#2a3290] rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* <div className="flex items-center gap-1">
                        <button
                          className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                          title="Like Article"
                        >
                          <Heart className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteArticle(post._id)}
                          disabled={deleteLoading === post._id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Article"
                        >
                          {deleteLoading === post._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div> */}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16 lg:py-24">
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {searchTerm ? "No Articles Found" : "No Articles Yet!"}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {searchTerm
                    ? `No articles match your search for "${searchTerm}". Try a different search term.`
                    : "Your article collection is empty. Ready to share your thoughts with the world?"}
                </p>

                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                    Create Your First Article
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
