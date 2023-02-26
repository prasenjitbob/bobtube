import React, { useEffect, useState } from "react";
import axios from "axios";
import app from "./../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 12;
  padding: 20px;
  top: 0;
  left: 0;
  background-color: #000000c7;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 2px;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 300;
  width: 27px;
  height: 27px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px dashed black;

  &:hover {
    background-color: #3ea6ff;
    color: #fff;
    border: 1px dashed ${({ theme }) => theme.hr};
  }
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.hr};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Description = styled.textarea`
  border: 1px solid ${({ theme }) => theme.hr};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 8px 18px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  background-color: #3ea6ff;
  margin: 8px 0;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imgPrecentage, setImgPrecentage] = useState(0);
  const [videoPrecentage, setVideoPrecentage] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const closeModal = () => {
    document.body.style.overflow = "unset";
    setOpen(false);
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPrecentage(Math.round(progress))
          : setVideoPrecentage(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    image && uploadFile(image, "imgUrl");
  }, [image]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/videos`, { ...inputs, tags });
    setOpen(false);
    if(res.status === 200){
      toast.success("Video uploaded successfully")
      setTimeout(() => navigate(`/video/${res.data._id}`), 2000);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={closeModal}>X</Close>
        <Title>Upload a new Video</Title>
        <Label>Video:</Label>
        {videoPrecentage > 0 ? (
          "Uploading: " + videoPrecentage + "%"
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Description
          placeholder="Description"
          rows={8}
          name="description"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Label>Image:</Label>
        {imgPrecentage > 0 ? (
          "Uploading: " + imgPrecentage + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        )}
        <Button
          disabled={imgPrecentage !== 100 || videoPrecentage !== 100}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
