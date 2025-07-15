import React, { useState, useEffect, useCallback } from "react";
import "./Home.css"; 
import motomindLogo from "./Assets/motomind_logo2.png"; 
import backgroundVideo from "./Assets/backgroundvideo.mp4";
import carouselImage1 from "./Assets/moto1.jpg";
import carouselImage2 from "./Assets/moto2.jpg";
import carouselImage3 from "./Assets/moto3.jpg";
import carouselImage4 from "./Assets/moto4.jpg";
import carouselImage5 from "./Assets/moto4.jpg";

const Home = () => {
  const images = [
    carouselImage1,
    carouselImage2,
    carouselImage3,
    carouselImage4,
    carouselImage5,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval); 
  }, [nextImage]);

  return (
    <div className="home-content">
      <div className="home-background">
        <video autoPlay loop muted className="background-video">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="logo fade-in">
          <img src={motomindLogo} alt="MotoMind Logo" />
        </div>
        <div className="slogan fade-in">
          <p>
            La conducción moderna es segura e inteligente. Manténte conectado,
            Manténte protegido.
          </p>
        </div>
      </div>

      <div className="products-section fade-in">
        <h2>Productos</h2>
        <div className="products-container">
          <div className="product">
            <h3>MotoMind L1</h3>
            <p>Precio: $3,000</p>
            <p>El MotoMind L1 ofrece protección avanzada con conectividad inteligente.</p>
          </div>
          <div className="product">
            <h3>MotoMind L2</h3>
            <p>Precio: $4,000</p>
            <p>El MotoMind L2 incluye características mejoradas para una conducción más segura y conectada.</p>
          </div>
          <div className="product">
            <h3>MotoMind Pro</h3>
            <p>Precio: $5,000</p>
            <p>El MotoMind Pro incluye características mejoradas para una conducción más segura y conectada.</p>
          </div>
        </div>
      </div>

      

      <div className="carousel fade-in">
        <button className="carousel-button left" onClick={prevImage}>
          ‹
        </button>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`carousel ${index}`}
            className={`carousel-image ${
              index === currentImageIndex ? "visible" : "hidden"
            }`}
          />
        ))}
        <button className="carousel-button right" onClick={nextImage}>
          ›
        </button>
      </div>


      <div className="features-section fade-in">
        <div className="feature-box">
          <i className="fas fa-thermometer-half"></i>
          <h3>Temperatura</h3>
          <p>
            Este sensor mide la temperatura ambiente y la muestra en grados
            Celsius, proporcionando información crucial para el monitoreo del
            entorno.
          </p>
        </div>
        <div className="feature-box">
          <i className="fas fa-tachometer-alt"></i>
          <h3>Velocidad</h3>
          <p>
            Utiliza un medidor de velocidad que muestra la velocidad actual en
            kilómetros por hora (km/h), permitiendo a los usuarios conocer su
            velocidad en tiempo real mientras conducen.
          </p>
        </div>
        <div className="feature-box">
          <i className="fas fa-tint"></i>
          <h3>Humedad</h3>
          <p>
            Este sensor mide el nivel de humedad en el ambiente y lo presenta en
            porcentaje (%), ayudando a los usuarios a estar conscientes de las
            condiciones de humedad alrededor de ellos.
          </p>
        </div>
        <div className="feature-box">
          <i className="fas fa-location-arrow"></i>
          <h3>Ubicación</h3>
          <p>
            Utiliza GPS para mostrar las coordenadas exactas (latitud y
            longitud) del usuario, proporcionando información precisa sobre su
            ubicación en tiempo real.
          </p>
        </div>
        <div className="feature-box">
          <i className="fas fa-compass"></i>
          <h3>Inclinación</h3>
          <p>
            Este sensor detecta la inclinación del casco y muestra el ángulo en
            grados, permitiendo a los usuarios tener conciencia de su posición
            relativa mientras conducen.
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Home;
