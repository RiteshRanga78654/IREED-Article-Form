"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useRef, useState, useEffect, useMemo } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import LogoGrid from "./components/industryPartner";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Home({ placeholder }) {
  //upload photo and article file state
  const [photo, setPhoto] = useState(null);
  const [articleFile, setArticleFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store uploaded image URL
  const [uploadedImageFilename, setUploadedImageFilename] = useState(""); // Store uploaded image filename
  const [uploadedFileUrl, setUploadedFileUrl] = useState(""); // Store uploaded file URL
  const [uploadedFileFilename, setUploadedFileFilename] = useState(""); // Store uploaded file filename
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    linkedinId: "", // ✅ changed to match API exactly
    title: "",
    article: "",
    category: "",
    attachedPdf: "", // ✅ added required field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // File size limit (5MB in bytes)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Jodit editor ref
  const editor = useRef(null);

  // Jodit editor config
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      toolbarAdaptive: false,
      toolbarSticky: false,
      uploader: {
        insertImageAsBase64URI: true,
      },
      // removeButtons: ['image'],
      disablePlugins: "drag-and-drop-element",
      controls: {
        image: {
          exec: function (editor) {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = function () {
              const file = input.files[0];
              const reader = new FileReader();
              reader.onload = function (e) {
                editor.selection.insertImage(e.target.result);
              };
              reader.readAsDataURL(file);
            };
            input.click();
          },
          icon: "image",
          tooltip: "Insert Image",
        },
      },
      style: {
        textAlign: "left",
      },
    }),
    [placeholder]
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Jodit editor changes
  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      article: content,
    }));
  };

  // ✅ Universal upload function for both images and files
  const handleFileUpload = async (file, fileType = "image") => {
    if (!file) return { url: "", filename: "" };

    try {
      console.log(`📎 Uploading ${fileType}:`, file.name);
      const fileFormData = new FormData();

      // Use same field name for both image and file uploads
      fileFormData.append("image", file);

      const uploadRes = await fetch(
        "https://ireed-articles-service.vercel.app/upload",
        {
          method: "POST",
          body: fileFormData,
        }
      );

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        console.log("✅ Upload response:", uploadData);

        // Extract URL and filename from the API response structure
        const uploadedUrl = uploadData.file?.url || "";
        const uploadedFilename = uploadData.file?.filename || "";

        console.log(`✅ ${fileType} uploaded successfully:`);
        console.log(`   URL: ${uploadedUrl}`);
        console.log(`   Filename: ${uploadedFilename}`);

        return { url: uploadedUrl, filename: uploadedFilename };
      } else {
        const errorText = await uploadRes.text();
        console.error("❌ Upload API error:", errorText);
        throw new Error(`${fileType} upload failed: ${errorText}`);
      }
    } catch (error) {
      console.error(`💥 ${fileType} upload error:`, error);
      throw error;
    }
  };

  // ✅ Check file size
  const checkFileSize = (file, maxSize = MAX_FILE_SIZE) => {
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(
        `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller file.`
      );
    }
  };

  // ✅ SweetAlert helper functions
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: "success",
      title: title,
      text: text,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Great!",
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Try Again",
    });
  };

  const showWarningAlert = (title, text) => {
    Swal.fire({
      icon: "warning",
      title: title,
      text: text,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Okay",
    });
  };

  // Handle photo selection and immediate upload
  const handlePhotoChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setPhoto(null);
      setUploadedImageUrl("");
      setUploadedImageFilename("");
      return;
    }

    try {
      // Check file size
      checkFileSize(selectedFile);

      setPhoto(selectedFile);
      setIsUploadingImage(true);

      // Upload the image using unified upload function
      const uploadResult = await handleFileUpload(selectedFile, "image");
      setUploadedImageUrl(uploadResult.url);
      setUploadedImageFilename(uploadResult.filename);
      console.log("🎉 Image uploaded successfully:", uploadResult);
    } catch (error) {
      console.error("❌ Failed to upload image:", error);
      showErrorAlert(
        "Upload Failed!",
        error.message || "Failed to upload image. Please try again."
      );
      setPhoto(null);
      setUploadedImageUrl("");
      setUploadedImageFilename("");
      e.target.value = "";
    } finally {
      setIsUploadingImage(false);
    }
  };

  // ✅ Handle attached file selection and upload
  const handleAttachedFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setArticleFile(null);
      setUploadedFileUrl("");
      setUploadedFileFilename("");
      return;
    }

    try {
      // Check file size
      checkFileSize(selectedFile);

      setArticleFile(selectedFile);
      setIsUploadingFile(true);

      // Upload the file using unified upload function
      const uploadResult = await handleFileUpload(selectedFile, "file");
      setUploadedFileUrl(uploadResult.url);
      setUploadedFileFilename(uploadResult.filename);
      console.log("🎉 File uploaded successfully:", uploadResult);
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
      showErrorAlert(
        "Upload Failed!",
        error.message || "Failed to upload file. Please try again."
      );
      setArticleFile(null);
      setUploadedFileUrl("");
      setUploadedFileFilename("");
      e.target.value = "";
    } finally {
      setIsUploadingFile(false);
    }
  };

  // ✅ Form Submit
  // ✅ Form Submit - Modified to send only filenames
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const articleData = {
        title: formData.title,
        slug,
        articleContent: formData.article,
        summary:
          formData.article.length > 200
            ? formData.article.substring(0, 200) + "..."
            : formData.article,
        uploadPhoto: uploadedImageFilename || "", // ✅ Changed: Send only filename instead of URL
        // uploadPhotoFilename: uploadedImageFilename || "", // ✅ Removed: No longer needed since we're using uploadPhoto for filename
        name: formData.name,
        designation: formData.designation,
        linkedinId: formData.linkedinId,
        company: formData.company,
        category: formData.category,
        status: "published",
        isPublished: true,
        attachedPdf: uploadedFileFilename || "", // ✅ Keep this as is - already sending filename only
      };

      console.log("📤 Sending article data:", articleData);
      console.log(
        "🖼️  uploadPhoto value (filename only):",
        uploadedImageFilename
      );
      console.log("📎 attachedPdf value:", uploadedFileFilename);

      const res = await fetch(
        "https://ireed-articles-service.vercel.app/v1/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        }
      );

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorData}`
        );
      }

      const data = await res.json();
      console.log("✅ Article submitted:", data);

      // ✅ SweetAlert success message
      showSuccessAlert(
        "Article Submitted Successfully!",
        "Your article has been published and will appear on the website shortly."
      );

      // Reset form
      setFormData({
        name: "",
        designation: "",
        company: "",
        linkedinId: "",
        title: "",
        article: "",
        category: "",
        attachedPdf: "",
      });
      setPhoto(null);
      setArticleFile(null);
      setUploadedImageUrl("");
      setUploadedImageFilename("");
      setUploadedFileUrl("");
      setUploadedFileFilename("");
      document.getElementById("uploadPhoto").value = "";
      document.getElementById("AttachFile").value = "";

      fetchArticles();
    } catch (err) {
      console.error("💥 Submission error:", err);
      showErrorAlert(
        "Submission Failed!",
        err.message ||
          "Something went wrong while submitting your article. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const swiperRef = useRef(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, []);

  // Manual autoplay for mobile only
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && window.innerWidth < 640) {
        swiperRef.current.slideNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://service.ireedindia.com/v1/articles?pageNumber=0&size=15",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched articles:", data);

      if (data.blogs && Array.isArray(data.blogs)) {
        setArticles(data.blogs);
      } else if (Array.isArray(data)) {
        setArticles(data);
      } else if (data.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else if (data.data && Array.isArray(data.data)) {
        setArticles(data.data);
      } else if (data.content && Array.isArray(data.content)) {
        setArticles(data.content);
      } else {
        console.warn("Unexpected data structure:", data);
        setArticles([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching articles:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `https://service.ireedindia.com/image/${imagePath}`;
  };

  // ✅ Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mx-auto flex justify-center bg-gray-100">
      <div className="min-h-screen flex flex-col bg-gray-50 pl-6 pr-6 pb-6 sm:pl-10 sm:pr-10 sm:pb-10 border-8 border-white w-full sm:w-4/5 lg:w-3/5 rounded-xl shadow-md">
        {/* Header */}
        <header className="w-full py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
            {/* Left Corner Logo */}
            <Image
              src="/assets/image/ireed-removebg-preview.png"
              alt="IREED logo"
              width={200}
              height={200}
              priority
              className="w-28 sm:w-38 md:w-44 lg:w-52 h-auto"
            />

            {/* Right Corner Logo */}
            <Image
              src="/assets/image/Institute_of_Real_Estate_Education___Entrepreneurship_Development-removebg-preview.png"
              alt="Institute logo"
              width={240}
              height={280}
              priority
              className="w-[185px] sm:w-40 md:w-48 lg:w-56 h-auto"
            />
          </div>
        </header>

        {/* Section: Insights */}
        <section className="flex-1 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="max-w-3xl mx-auto text-center px-4 ">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-2 leading-tight mt-4">
                Expert Edge
              </h2>
              <div className="mx-auto justify-center items-center h-[3px] mb-1 mt[-4px] w-[100px] bg-[#004aad]"></div>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 ">
                {/* Desktop / Tablet (inline text) */}
                <span className="hidden sm:block text-xl sm:text-2xl md:text-[15px] text-[#004aad] mb-4">
                  Be a Thought Leader | Share your Perspective | Inspire
                  Industry Peers
                </span>
                {/* Mobile (stacked text) */}
                <div className="block sm:hidden text-xl text-[#004aad] mb-4 space-y-1 sm:justify-text">
                  <p>Be a Thought Leader |</p>
                  <p>Share your Perspective |</p>
                  <p>Inspire Industry Peers |</p>
                </div>
                Your knowledge and experiences can inspire, guide, and add
                immense value to aspiring professionals and industry peers.{" "}
                {/* <span className="text-gray-800 font-medium"> */}
                Inviting top Corporate professionals and Entrepreneurs to
                contribute insightful articles on real estate, upcoming trends,
                technological innovations, leadership journeys, and more.
                {/* </span> */}
              </p>

              {/* <button className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                Contribute Now
              </button> */}
            </div>

            {/* Swiper Carousel */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4 relative">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading articles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Error loading articles: {error}
                  </p>
                  <button
                    onClick={fetchArticles}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : articles.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  spaceBetween={20}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={{
                    enabled: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      autoplay: false,
                    },
                    1024: {
                      slidesPerView: 3,
                      autoplay: false,
                    },
                  }}
                  className="articles-swiper"
                >
                  {articles.map((article, index) => (
                    <SwiperSlide key={article._id || article.id || index}>
                      <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition h-full">
                        <div className="relative">
                          <Image
                            src={
                              getImageUrl(
                                article?.image || article.uploadPhoto
                              ) ||
                              "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
                            }
                            alt={
                              article.featuredImageAltText ||
                              `Article: ${article.title}`
                            }
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                            unoptimized={true}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {article.summary || article.articleContent}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{article.name}</span>
                            <span>{article.designation}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                            <span>{article.company}</span>
                            {article.createdAt && (
                              <span>
                                {new Date(
                                  article.createdAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No articles available</p>
                </div>
              )}

              {/* Custom Navigation Buttons */}
              {articles.length > 0 && (
                <>
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute top-1/2 -left-5 sm:-left-8 transform -translate-y-1/2 text-black bg-white px-2 py-1 rounded-full shadow hover:bg-blue-600 hover:text-white transition z-10 hidden sm:block"
                  >
                    <IoIosArrowBack className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute top-1/2 -right-5 sm:-right-8 transform -translate-y-1/2 text-black bg-white px-2 py-1 rounded-full shadow hover:bg-blue-600 hover:text-white transition z-10 hidden sm:block"
                  >
                    <IoIosArrowForward className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="text-center mt-6">
                <a
                  href="https://www.ireedindia.com/articles"
                  className="inline-block px-6 py-2 bg-[#2a3290] text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  View All
                </a>
              </div>
            </div>
          </div>

          <div>
            <LogoGrid />
          </div>

          {/* Form Section */}
          <div className="pt-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 max-w-4xl mx-auto w-full px-4 sm:px-6"
            >
              <input
                className="w-full h-10 border hover:border-[#495057] py-6 px-2 rounded"
                placeholder="Name (Author)*"
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-full h-10 border py-6 px-2 rounded"
                placeholder="Designation*"
                type="text"
                name="designation"
                id="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
              />

              <input
                className="w-full h-10 border py-6 px-2 rounded"
                placeholder="LinkedIn ID*"
                type="text"
                name="linkedinId"
                id="linkedinId"
                value={formData.linkedinId}
                onChange={handleInputChange}
                // required
              />

              {/* <input
                className="w-full h-10 border py-2 px-2 rounded bg-white"
                name="category"
                id="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                Placeholder
              </input> */}

              <input
                className="w-full h-10 border py-6 px-2 rounded"
                placeholder="Company*"
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />

              <input
                className="w-full h-10 border py-6 px-2 rounded"
                placeholder="Title (Max 75 Words)*"
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              {/* Jodit Editor replacing textarea */}
              <div className="w-full border rounded">
                <JoditEditor
                  ref={editor}
                  value={formData.article}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => handleEditorChange(newContent)} // Fixed: pass the content
                  onChange={(newContent) => handleEditorChange(newContent)} // Fixed: handle real-time changes
                />
              </div>

              {/* Upload Photo */}
              <div className="relative w-full">
                <input
                  type="file"
                  id="uploadPhoto"
                  name="uploadPhoto"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <label
                  htmlFor="uploadPhoto"
                  className="flex justify-between items-center w-full h-10 border py-6 px-2 rounded text-gray-500 cursor-pointer hover:border-blue-500"
                >
                  <span>
                    {photo
                      ? isUploadingImage
                        ? `⏳ Uploading ${photo.name}...`
                        : uploadedImageUrl
                        ? `✅ ${photo.name} (${formatFileSize(
                            photo.size
                          )}) - Uploaded`
                        : `❌ ${photo.name} - Upload failed`
                      : "Upload Photo (Max 5MB)"}
                  </span>
                  <span className="text-[#2a3290]">Choose Image</span>
                </label>
              </div>

              {/* Attach Article File */}
              <div className="relative w-full">
                <input
                  type="file"
                  id="AttachFile"
                  name="attachFile"
                  onChange={handleAttachedFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                />
                <label
                  htmlFor="AttachFile"
                  className="flex justify-between items-center w-full h-10 border py-6 px-2 rounded text-gray-500 cursor-pointer hover:border-blue-500"
                >
                  <span>
                    {articleFile
                      ? isUploadingFile
                        ? `⏳ Uploading ${articleFile.name}...`
                        : uploadedFileUrl
                        ? `✅ ${articleFile.name} (${formatFileSize(
                            articleFile.size
                          )}) - Uploaded`
                        : `❌ ${articleFile.name} - Upload failed`
                      : "Attach Article File (Max 5MB)"}
                  </span>
                  <span className="text-[#2a3290]">Upload File</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage || isUploadingFile}
                className={`w-32 h-10 border-1 ${
                  isSubmitting || isUploadingImage || isUploadingFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2a3290] hover:bg-gray-100 hover:text-[#2a3290] hover:cursor-pointer"
                } text-white flex items-center justify-center mx-auto rounded transition`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isUploadingImage || isUploadingFile
                  ? "Uploading..."
                  : "Submit"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .articles-swiper .swiper-pagination {
          position: static !important;
          margin-top: 1rem;
          text-align: center !important;
          display: flex !important;
          justify-content: center !important;
        }

        .articles-swiper .swiper-pagination-bullet {
          background: #2563eb;
          opacity: 0.3;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .articles-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #2563eb;
        }

        @media (min-width: 640px) {
          .articles-swiper .swiper-pagination {
            display: none !important;
          }
        }

        /* Ensure pagination bullets are centered on mobile */
        @media (max-width: 639px) {
          .articles-swiper .swiper-pagination {
            position: static !important;
            margin-top: 1rem !important;
            text-align: center !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
          }

          .articles-swiper .swiper-pagination-bullets {
            display: flex !important;
            justify-content: center !important;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Jodit Editor Styles */
        .jodit-container {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
