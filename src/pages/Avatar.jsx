import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import editIcon from "../assets/select.png";


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  h1 {
    color: white;
    text-transform: uppercase;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    align-items: center;
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  .edit-icon {
    bottom: 5px;
    right: 5px;
    width: 10rem;
    height: 10rem;
    background-color: #1c00ff00;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .edit-icon img {
    width: 100%;
    height: 100%;
  }
  input[type="file"] {
    display: none;
  }
  p {
    color: white;
    text-transform: uppercase;
    font-size: smaller;
  }
`;

const Avatar = () => {
  const [SelectedAvatar, setSelectedAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = () => {
    if (SelectedAvatar === "") {
      toast.error("Please select an image!", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      try {
        const { data } = await axios.post(setAvatarRoute, {
          SelectedAvatar,
          _id: JSON.parse(localStorage.getItem("chat-app-user"))._id,
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }

        if (data.status === true) {
          localStorage.setItem(
            "chat-app-user",
            JSON.stringify(data.avatarModifiedCheck)
          );
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to set avatar. Please try again.", toastOptions);
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedAvatar("data:image/png;base64," + reader.result.split(",")[1]);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <FormContainer>
          <img src={loader} alt="loader" />
        </FormContainer>
      ) : (
        <FormContainer>
          <h1>Please select a profile picture</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="avatar-input" className="edit-icon">
              <img src={editIcon} alt="Edit Icon" />
            </label>
            <input
              type="file"
              id="avatar-input"
              name="SelectedAvatar"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
            <button className="submit-btn" type="submit">
              Set Profile Picture
            </button>
            <p>Please click on the image icon to select an image</p>
          </form>
          <ToastContainer />
        </FormContainer>
      )}
    </>
  );
};

export default Avatar;
