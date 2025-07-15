import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./Login.css";
import { FaUser, FaRedo } from "react-icons/fa";
import { RiGoogleFill } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); 

  const showPopupMessage = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const generateCaptcha = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    setCaptchaQuestion({ num1, num2, answer });
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    setShowLoginForm(action !== "register");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [location.search, navigate]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const verifyCaptcha = () => {
    const userAnswer = parseInt(captchaInput);
    if (userAnswer === captchaQuestion.answer) {
      setCaptchaPassed(true);
      setCaptchaError("");
      showPopupMessage("¡Captcha verificado correctamente!", "success");
    } else {
      setCaptchaError("Respuesta incorrecta. Inténtalo de nuevo.");
      showPopupMessage("Respuesta incorrecta. Inténtalo de nuevo.", "error");
      generateCaptcha();
    }
  };

  const handleCaptchaInputChange = (e) => {
    setCaptchaInput(e.target.value);
    setCaptchaError("");
  };

  const handleCaptchaKeyPress = (e) => {
    if (e.key === "Enter") {
      verifyCaptcha();
    }
  };

  const toggleForms = () => {
    setShowLoginForm(!showLoginForm);
    setError("");
    setEmail("");
    setPassword("");
    setPasswordError("");
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validatePassword(password)) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("¡Inicio de sesión exitoso!");
      navigate("/");
    } catch (error) {
      setError("Error en el inicio de sesión. Por favor, verifica tus credenciales.");
    }
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("¡Registro exitoso!");
      navigate("/");
    } catch (error) {
      setError(error.code === "auth/weak-password" ? 
        "La contraseña debe tener al menos 6 caracteres." : 
        "Error en el registro. Por favor, inténtalo de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("¡Inicio de sesión con Google exitoso!");
      navigate("/");
    } catch (error) {
      setError("Error en el inicio de sesión con Google. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-body">
      {showPopup && (
        <div className={`popup-overlay ${showPopup ? 'show' : ''}`}>
          <div className={`popup-message ${popupType}`}>
            <span>{popupMessage}</span>
            <button 
              className="popup-close" 
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container-login fade-in">
        {!captchaPassed ? (
          <div className="form-container fade-in">
            <h2>Verificación de Seguridad</h2>
            <p>Por favor, resuelve la siguiente operación matemática para continuar:</p>
            
            <div className="captcha-container">
              <div className="math-captcha">
                <div className="captcha-question">
                  <span className="captcha-label">¿Cuánto es</span>
                  <span className="captcha-math">
                    {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                  </span>
                </div>
                
                <div className="captcha-question">
                  <input
                    type="number"
                    className="captcha-input"
                    value={captchaInput}
                    onChange={handleCaptchaInputChange}
                    onKeyPress={handleCaptchaKeyPress}
                    placeholder="?"
                    autoFocus
                  />
                  <button 
                    className="refresh-captcha" 
                    onClick={generateCaptcha}
                    title="Generar nueva pregunta"
                  >
                    <FaRedo />
                  </button>
                </div>
                
                {captchaError && <p className="captcha-error">{captchaError}</p>}
              </div>
            </div>
            
            <div className="button-container">
              <button className="iniciar-button" onClick={verifyCaptcha}>
                Verificar
              </button>
            </div>
          </div>
        ) : (
          <>
            {showLoginForm ? (
              <div id="loginForm" className="form-container fade-in">
                <h2>Iniciar sesión</h2>
                {error && <p className="error">{error}</p>}
                <div className="input-container">
                  <input
                    type="email"
                    id="loginEmail"
                    placeholder="Correo electrónico"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="password"
                    id="loginPassword"
                    placeholder="Contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <div className="button-container">
                  <button className="iniciar-button" onClick={handleLogin}>
                    <FaUser className="button-icon" /> Iniciar sesión
                  </button>
                  <button className="iniciar-button google-button" onClick={handleGoogleLogin}>
                    <RiGoogleFill className="button-icon" /> Iniciar sesión con Google
                  </button>
                </div>
                <p>
                  ¿No tienes una cuenta?{" "}
                  <button className="link-button" onClick={toggleForms}>
                    Regístrate ahora
                  </button>
                </p>
              </div>
            ) : (
              <div id="registerForm" className="form-container fade-in">
                <h2>Registro</h2>
                {error && <p className="error">{error}</p>}
                <div className="input-container">
                  <input
                    type="email"
                    id="registerEmail"
                    placeholder="Correo electrónico"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="password"
                    id="registerPassword"
                    placeholder="Contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <div className="button-container">
                  <button className="iniciar-button" onClick={handleRegister}>
                    <FaUser className="button-icon" /> Registrarse
                  </button>
                  <button className="iniciar-button google-button" onClick={handleGoogleLogin}>
                    <RiGoogleFill className="button-icon" /> Registrarse con Google
                  </button>
                </div>
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <button className="link-button" onClick={toggleForms}>
                    Iniciar sesión
                  </button>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;