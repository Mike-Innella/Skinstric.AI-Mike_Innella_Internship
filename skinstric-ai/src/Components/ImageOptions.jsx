import React, { useState, useRef, useEffect } from "react";
import ShutterIcon from "./SVG/ShutterIcon";
import GalleryIcon from "./SVG/GalleryIcon";
import CaptureImage from "../Utils/CaptureImage";
import LoadingCanvas from "../UI/Animations/LoadingCanvas";
import "../UI/Styles/Components/ImageOptions.css";
import { ReactComponent as PolygonWhiteIcon } from "../Assets/PolygonWhite.svg";

import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

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
  const canvasRef = useRef(null);

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
      console.log("Setting canProceed to true after camera image capture");
      onCanProceed?.(true);
      onImageReady?.(syntheticEvent);
    } catch (error) {
      console.error("Error processing camera image:", error);
      setError("Error processing camera image");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

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
        console.log("Setting canProceed to true after gallery image selection");
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
      }, 2400);
    } else {
      setShowCamera(false);
      setCameraPermissionState("initial");
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    let net;
    let interval;

    const runSegmentation = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;

      await new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
        }
      });

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      net = await bodyPix.load();

      interval = setInterval(async () => {
        // 1. Get the canvas context
        const ctx = canvas.getContext("2d");
        // 2. Save the context state
        ctx.save();
        // 3. Mirror horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // 4. Run segmentation
        const segmentation = await net.segmentPerson(video, {
          internalResolution: "high",
          segmentationThreshold: 0.7,
        });

        // 5. Draw the bokeh effect (onto the mirrored context)
        await bodyPix.drawBokehEffect(
          canvas,
          video,
          segmentation,
          96,
          2,
          false
        );

        // 6. Restore the context state
        ctx.restore();
      }, 100);
    };

    if (cameraPermissionState === "ready") {
      runSegmentation();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraPermissionState]);

  return (
    <div className="image-options">
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
                  <div className="image-options__camera-setup">
                    <div className="image-options__camera-loading">
                      <LoadingCanvas message="SETTING UP CAMERA..." />
                      <div className="image-options__camera-icon-container">
                        <ShutterIcon className="image-options__camera-icon" />
                      </div>
                    </div>
                    <div className="image-options__camera-instructions">
                      <p className="image-options__instructions-title image-options__instructions-title--setup">
                        TO GET BETTER RESULTS MAKE SURE TO HAVE
                      </p>
                      <div className="image-options__instructions-items">
                        <div className="image-options__instruction-item">
                          <div className="image-options__instruction-checkbox image-options__instruction-checkbox--setup"></div>
                          <div className="image-options__instruction-text image-options__instruction-text--setup">
                            NEUTRAL EXPRESSION
                          </div>
                        </div>
                        <div className="image-options__instruction-item">
                          <div className="image-options__instruction-checkbox image-options__instruction-checkbox--setup"></div>
                          <div className="image-options__instruction-text image-options__instruction-text--setup">
                            FRONTAL POSE
                          </div>
                        </div>
                        <div className="image-options__instruction-item">
                          <div className="image-options__instruction-checkbox image-options__instruction-checkbox--setup"></div>
                          <div className="image-options__instruction-text image-options__instruction-text--setup">
                            ADEQUATE LIGHTING
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: "absolute",
                  visibility: "visible",
                  width: "100vw",
                  height: "100vh",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
              {cameraPermissionState === "ready" && (
                <div
                  className="camera-back-button"
                  onClick={() => {
                    stopCameraStream();
                    setShowCamera(false);
                    setCameraPermissionState("initial");
                  }}
                >
                  <div className="camera-back-border"></div>
                  <div className="camera-back-icon-container">
                    <PolygonWhiteIcon className="camera-back-icon" />
                  </div>
                </div>
              )}
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
            </div>
          </div>
        ))}

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

      {error && <div className="image-options__error">{error}</div>}
    </div>
  );
};

export default ImageOptions;
