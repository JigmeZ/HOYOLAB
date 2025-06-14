import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const UploadsPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Fetch uploaded files from backend
  const fetchUploads = () => {
    fetch("http://localhost:4000/uploads")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // Drag and drop upload handler
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError("");
    if (rejectedFiles.length > 0) {
      setError("Invalid file type or size.");
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:4000/api/upload/image");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      };
      xhr.onload = () => {
        setUploading(false);
        setProgress(0);
        if (xhr.status === 200) {
          fetchUploads();
        } else {
          setError("Upload failed");
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setError("Upload failed");
      };
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setError("Upload failed");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    multiple: false,
    accept: { "image/*": [] },
  });

  return (
    <div
      style={{ padding: 32, maxWidth: 600, margin: "0 auto", color: "#fff" }}
    >
      <h2 style={{ marginBottom: 24 }}>Image Upload (Drag & Drop)</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #aaa",
          borderRadius: 8,
          padding: 32,
          textAlign: "center",
          background: "#18181c",
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>
          {isDragActive
            ? "Drop the image here ..."
            : "Drag & drop an image here, or click to select"}
        </div>
        <div style={{ fontSize: 14, color: "#aaa", marginTop: 8 }}>
          (Only images under 10MB are accepted)
        </div>
      </div>
      {uploading && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              width: "100%",
              background: "#444",
              borderRadius: 8,
              height: 10,
              overflow: "hidden",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                background: "#4e88ff",
                height: "100%",
                transition: "width 0.3s",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#aaa" }}>
            Uploading... {progress}%
          </span>
        </div>
      )}
      {error && (
        <div style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</div>
      )}
      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Uploaded Images</h3>
      {loading ? (
        <div>Loading...</div>
      ) : files.length === 0 ? (
        <div>No uploads found.</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {files.map((url, idx) => {
            const ext = url.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
              return (
                <img
                  key={idx}
                  src={`http://localhost:4000${url}`}
                  alt={url}
                  style={{ width: 180, borderRadius: 8, objectFit: "cover" }}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default UploadsPage;
