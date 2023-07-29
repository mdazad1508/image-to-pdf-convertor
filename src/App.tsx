import React, { ChangeEventHandler } from "react";
import * as Helpers from "./helpers";
import { CustomImage } from "./custom-image";
import "./App.css"

function App(){
  const [uploadedImages, setUploadedImages] = React.useState<CustomImage[]>([]);

  const handleImageUpload = React.useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const fileList = event.target.files;
      const fileArray = fileList ? Array.from(fileList) : [];
      const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);

      Promise.all(fileToImagePromises).then(setUploadedImages);
    },
    [setUploadedImages]
  );

  const cleanUpUploadedImages = React.useCallback(() => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }, [setUploadedImages, uploadedImages]);

  const generatePdfFromImages = React.useCallback(() => {
    Helpers.generatePdfFromImages(uploadedImages);
    cleanUpUploadedImages();
  }, [uploadedImages, cleanUpUploadedImages]);

  return (
    <>
      <h1>Convert images to PDFs</h1>

      <div className="images-container">
        {uploadedImages.length > 0 ? (
          uploadedImages.map((image) => (
            <img key={image.src} alt="123" src={image.src} className="uploaded-image" />
          ))
        ) : (
          <p>Upload some images...</p>
        )}
      </div>

      <div className="buttons-container">
        <label htmlFor="file-input">
          <span className="button">Upload images</span>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            multiple
          />
        </label>

        <button
          onClick={generatePdfFromImages}
          className="button"
          disabled={uploadedImages.length === 0}
        >
          Generate PDF
        </button>
      </div>
      <div className="description">
          <p style={{color:"white" }}>The image-to-PDF converter is a web-based tool designed to help users convert multiple images into a single PDF document. The web page features a clean and modern user interface. At the top, a bold heading "Convert images to PDFs" grabs the user's attention. Below the heading, there is a container to display the uploaded images. Users can upload multiple images by clicking the "Upload images" button. Each uploaded image is shown as a thumbnail, aligned neatly in rows, and wrapped when necessary.</p>
        </div>
    </>
  );
}

export default App;
