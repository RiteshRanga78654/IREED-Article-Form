"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Clock, Tag, ExternalLink, FileText, Loader2 } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://ireed-articles-service.vercel.app/v1/articles/${id}`,
        { 
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const response = await res.json();
      console.log("API Response:", response); // Debug log
      
      // Fix: Access the nested data object
      if (response && response.data) {
        setArticle(response.data);
      } else {
        // Fallback if structure is different
        setArticle(response);
      }
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/assets/image/placeholder.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `https://ireed-articles-service.vercel.app/image/${path}`;
  };

  const getReadingTime = (text) => {
    if (!text) return "1 min read";
    const cleanText = text.replace(/<[^>]*>/g, '');
    const words = cleanText.split(' ').length;
    const readingTime = Math.ceil(words / 200);
    return `${readingTime} min read`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Article</h3>
          <p className="text-gray-500">Please wait while we fetch the content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Article</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => fetchArticle()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Article Not Found</h3>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
     {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          {/* <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button> */}

          {/* Main Article Card */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Hero Image */}
            <div className="relative w-full h-80 sm:h-80 lg:h-96 overflow-hidden">
              <Image
                src={getImageUrl(article.uploadPhoto)}
                alt={article.title || "Article image"}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Article category badge */}
              {/* {article.category && (
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-800 shadow-lg">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category : {article.category}
                </div>
              )} */}
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 lg:p-12">
              
              {/* Article Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
               Title :  {article.title || "Untitled Article"}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                   Author : {article.name || "Anonymous Author"}
                  </span>
                </div>
                
                {article.createdAt && (
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                )}
                
                {/* <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {getReadingTime(article.articleContent || article.summary)}
                  </span>
                </div> */}
                
                {article.designation && (
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-medium text-orange-800">
                    Designation : {article.designation}
                    </span>
                  </div>
                )}
  
                 {article.category && (
                  <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-medium text-pink-800">
                     Category : {article.category}
                    </span>
                  </div>
                )}
                

              </div>

              {/* Article Summary */}
              {article.summary && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  />
                </div>
              )}

              {/* Main Article Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ 
                    __html: article.articleContent || "No content available." 
                  }}
                />
              </div>

              {/* Additional Information */}
              {(article.linkedinId || article.attachedPdf) && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Resources</h3>
                  <div className="flex flex-wrap gap-4">
                    
                    {article.linkedinId && (
                      <a
                        href={article.linkedinId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    
                    {article.attachedPdf && (
                      <a
                        href={`https://ireed-articles-service.vercel.app/image/${article.attachedPdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}