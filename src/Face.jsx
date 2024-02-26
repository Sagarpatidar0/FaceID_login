import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import "./face.css";
import Home from "./Home";

const FaceRecognition = () => {
  const [people, setPeople] = useState(0);
  const intervalRef = useRef(null);

  const webcamRef = useRef(null);
  const handleImage = async () => {
    try {
      const videoEl = webcamRef.current.video;
      const detections = await faceapi
        .detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      console.log(detections);

      if (detections.length > 0) {
        clearInterval(intervalRef.current);
        setPeople(detections.length);
      } else setPeople(0);
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(
          handleImage,
          (intervalRef.current = setInterval(handleImage, 3000))
        )
        .catch((e) => console.log(e));
    };
    webcamRef.current && loadModels();
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="webcam">
      {people <= 0 ? (
        <>
          <Webcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
            ref={webcamRef}
          ></Webcam>
          <p className="desc">Please, Come in center and proper light to login </p>
        </>
      ) : (
        <Home />
      )}
    </div>
  );
};

export default FaceRecognition;
