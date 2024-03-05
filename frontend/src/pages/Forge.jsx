import {useState} from 'react'
import axios from 'axios'
import './Forge.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Forge = () => {
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [prediction, setPrediction] = useState('');

    const handleImageUpload = (e) => {
        setPrediction('')
        setImage(e.target.files[0]);
    
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleDrop = (e) => {
        setPrediction('')
        setImage(e.dataTransfer.files[0]);
    
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
        
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
      };
    
      const handleDragLeave = () => {
        setIsDragging(false);
      };

      const handleSubmit = async () => {
        if (!image) {
          setErrorMessage('Please upload an image to predict.');
          return;
        }
        const formData = new FormData();
        formData.append('file', image);
    
        try {
          const response = await axios.post(`${BACKEND_URL}/predict-forge`, formData);
          if (response.status === 200) {
            const result = response.data;
            setPrediction(result);
            setErrorMessage('');
          } else {
            setErrorMessage('Error: Unable to make a prediction.');
            setPrediction('');
          }
        } catch (error) {
          console.error('An error occurred:', error);
          setErrorMessage('An error occurred while making the request.');
          setPrediction('');
        }
      };

    return(
        <div className="CifarApp">
            <div className="CifarContainer">
                <h1 className="CifarHeader">CIFAR 10</h1>
                <div
                    className={`drop-area ${isDragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <p>Drag and drop an image here or</p>
                    <label className="file-input-label">
                        Browse
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                    </label>
                </div>
                {selectedImage && (<div className="column">
                    <h3>Uploaded Image</h3>
                    <img src={selectedImage} alt="selected" className="uploaded-image"/>
                    <button className="CifarButton" onClick={handleSubmit}>Predict</button>
                </div>)}
                {prediction && (
                    <>
                        <p className="PotatoDisease-class">{prediction.class}</p>
                        <p className="PotatoDisease-confidence">
                        {Math.round(prediction.confidence * 100) / 100}%
                        </p>
                    </>
                )}
                {errorMessage && (<div className="error">{errorMessage}</div>)}
            </div>
        </div>
    )
}

export default Forge