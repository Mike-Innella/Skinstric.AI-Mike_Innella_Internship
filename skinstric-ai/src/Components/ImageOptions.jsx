import React, { useState, useRef } from "react";
import ShutterIcon from "./SVG/ShutterIcon";
import GalleryIcon from "./SVG/GalleryIcon";
import CaptureImage from "../Utils/CaptureImage";
import "../UI/Styles/Components/ImageOptions.css";
import ellipseSvg from "../Assets/Ellipse 93.svg";

const EllipseDot = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 118 118"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx="59" cy="59" r="58" stroke="#000000" strokeWidth="2" />
  </svg>
);

const ImageOptions = ({ onImageSelected, onCanProceed, onImageReady }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImageEvent, setCapturedImageEvent] = useState(null);
  const [cameraPermissionState, setCameraPermissionState] = useState("initial");
  const fileInputRef = useRef(null);

  const { videoRef, requestCameraAccess, captureImage, stopCameraStream } =
    CaptureImage({
      onImageCaptured: (base64Image) => {
        handleImageSelected(base64Image);
        setShowCamera(false);
        setCameraPermissionState("initial");
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setTimeout(() => setError(""), 3000);
        setCameraPermissionState("initial");
      },
    });

  const handleFileChange = (event) => {
    setIsProcessing(true);
    const file = event.target.files[0];
    if (!file) return setIsProcessing(false);

    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      setTimeout(() => setError(""), 3000);
      return setIsProcessing(false);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        setSelectedImage(reader.result);
        setCapturedImageEvent(event);
        // Set canProceed to true to enable the submit button
        onCanProceed?.(true);
        onImageReady?.(event);
        setIsProcessing(false);
      } catch (error) {
        console.error("Error processing image:", error);
        setError("Error processing image");
        setTimeout(() => setError(""), 3000);
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setError("Error reading file");
      setTimeout(() => setError(""), 3000);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelected = (base64Image) => {
    setIsProcessing(true);
    try {
      const byteCharacters = atob(base64Image);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(byteArrays)], {
        type: "image/jpeg",
      });
      const file = new File([blob], "camera-image.jpg", { type: "image/jpeg" });
      setSelectedImage(`data:image/jpeg;base64,${base64Image}`);

      const syntheticEvent = { target: { files: [file] } };
      setCapturedImageEvent(syntheticEvent);
      
      // Set canProceed to true to enable the submit button
      onCanProceed?.(true);
      
      // Trigger the image upload in the parent component
      onImageReady?.(syntheticEvent);
    } catch (error) {
      console.error("Error processing camera image:", error);
      setError("Error processing camera image");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraClick = () => {
    setCameraPermissionState("requesting");
    setShowCamera(true);
  };

  const handleCameraPermission = async (allow) => {
    if (allow) {
      setCameraPermissionState("setting-up");
      setTimeout(async () => {
        try {
          await requestCameraAccess();
          setCameraPermissionState("ready");
        } catch (error) {
          console.error("Error accessing camera:", error);
          setError(error.message || "Error accessing camera");
          setTimeout(() => setError(""), 5000);
          setShowCamera(false);
          setCameraPermissionState("initial");
        }
      }, 2800);
    } else {
      setShowCamera(false);
      setCameraPermissionState("initial");
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-options">
      {!selectedImage ? (
        <>
          <div
            className="image-options__option image-options__option--left"
            onClick={handleCameraClick}
          >
            <div className="image-options__diamond">
              <div className="image-options__icon-container">
                <ShutterIcon className="image-options__icon" />
                <div className="image-options__label-container image-options__label-container--left">
                  <div className="image-options__callout">
                    <div className="image-options__callout-line" />
                    <EllipseDot />
                    <div className="image-options__callout-text">
                      <span>
                        ALLOW A.I. <br /> TO SCAN YOUR FACE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="image-options__option image-options__option--right"
            onClick={handleGalleryClick}
          >
            <div className="image-options__diamond">
              <div className="image-options__icon-container">
                <GalleryIcon className="image-options__icon" />
                <div className="image-options__label-container image-options__label-container--right">
                  <div className="image-options__callout">
                    <div className="image-options__callout-text">
                      <span>
                        ALLOW A.I. <br /> ACCESS TO GALLERY
                      </span>
                    </div>
                    <EllipseDot />
                    <div className="image-options__callout-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="image-options__preview">
          <img
            src={selectedImage}
            alt="Selected"
            className="image-options__preview-image"
          />
          <div
            className={`image-options__preview-overlay ${
              capturedImageEvent
                ? "image-options__preview-overlay--visible"
                : ""
            }`}
          >
            <div className="image-options__preview-text">
              {isProcessing ? "Processing..." : "Image Selected"}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {showCamera &&
        (cameraPermissionState === "requesting" ? (
          <div className="image-options__permission-wrapper">
            <div className="image-options__permission-dialog">
              <div className="image-options__permission-content">
                <div className="image-options__permission-text">
                  ALLOW A.I. TO ACCESS YOUR CAMERA
                </div>
                <div className="image-options__permission-buttons">
                  <button
                    className="image-options__permission-button image-options__permission-button--deny"
                    onClick={() => handleCameraPermission(false)}
                  >
                    DENY
                  </button>
                  <button
                    className="image-options__permission-button image-options__permission-button--allow"
                    onClick={() => handleCameraPermission(true)}
                  >
                    ALLOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="image-options__camera-screen">
            <div className="image-options__camera-container">
              {cameraPermissionState === "setting-up" && (
                <div className="image-options__setup-screen">
                  <div className="image-options__setup-content">
                    <div className="image-options__setup-text">
                      SETTING UP CAMERA...
                    </div>
                  </div>
                </div>
              )}
              {cameraPermissionState === "ready" && (
                <>
                  <div className="image-options__video-wrapper">
                    <video
                      ref={videoRef}
                      className="image-options__video-element"
                      autoPlay
                      playsInline
                      muted
                      onError={(e) => {
                        console.error("Video element error:", e);
                        setError(
                          "Video error: " +
                            (e.target.error?.message || "Unknown error")
                        );
                        setTimeout(() => setError(""), 5000);
                      }}
                    />
                  </div>
                  <div className="image-options__camera-controls">
                    <div className="image-options__take-pic">
                      <div
                        className="image-options__camera-button-container"
                        onClick={captureImage}
                      >
                        <div className="image-options__camera-button-inner"></div>
                        <div className="image-options__camera-button-outer"></div>
                      </div>
                      <div className="image-options__take-picture-text">
                        TAKE PICTURE
                      </div>
                    </div>
                  </div>
                  <div className="image-options__camera-instructions">
                    <p className="image-options__instructions-title">
                      TO GET BETTER RESULTS MAKE SURE TO HAVE
                    </p>
                    <div className="image-options__instructions-items">
                      <div className="image-options__instruction-item">
                        <div className="image-options__instruction-checkbox"></div>
                        <div className="image-options__instruction-text">
                          NEUTRAL EXPRESSION
                        </div>
                      </div>
                      <div className="image-options__instruction-item">
                        <div className="image-options__instruction-checkbox"></div>
                        <div className="image-options__instruction-text">
                          FRONTAL POSE
                        </div>
                      </div>
                      <div className="image-options__instruction-item">
                        <div className="image-options__instruction-checkbox"></div>
                        <div className="image-options__instruction-text">
                          ADEQUATE LIGHTING
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

      {error && <div className="image-options__error">{error}</div>}
    </div>
  );
};

export default ImageOptions;
