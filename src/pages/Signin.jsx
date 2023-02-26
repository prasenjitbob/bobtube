import axios from "axios";
import React, { useState } from "react";
import app from "./../firebase";
import styled from "styled-components";
import { useUser } from "../context/UserContext";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./../styles/signin.css";
import { baseURL } from "../config";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 192px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.hr};
  padding: 20px 50px;
  gap: 10px;
  border-radius: 2px;
  position: relative;
  right: 7%;
  // bottom: 7%;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.hr};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
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

const ImageInput = styled.input`
  border: 1px solid ${({ theme }) => theme.hr};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  width: 100%;
  margin-top: 10px;
`;

const Signin = () => {
  const navigate = useNavigate();
  const { setLoading, login, logError } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imgPrecentage, setImgPrecentage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/auth/signin`, { name, password });
      login(res.data);
      setLoading(false);
      navigate("/");
    } catch (err) {
      logError(err);
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await axios.post(`${baseURL}/auth/signup`, {
      email,
      name,
      password,
      img: imageUrl,
    });
    toast.success("Sign up successfull");
    setTimeout(() => window.location.reload(), 3000);
  };

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPrecentage(Math.round(progress));
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
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) =>
        axios
          .post(`${baseURL}/auth/google`, {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            login(res.data);
            navigate("/");
          })
      )
      .catch((err) => logError(err));
  };

  useEffect(() => {
    image && uploadFile(image);
  }, [image]);

  return (
    <Container>
      <Wrapper className="signin_wrapper">
        <Title>Sign in</Title>
        {/* <SubTitle></SubTitle> */}
        <Input placeholder="Username" onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonContainer>
          <Button onClick={handleLogin}>Sign in</Button>
          <Button onClick={signInWithGoogle}>Google Sign in</Button>
        </ButtonContainer>
        <SubTitle>or</SubTitle>
        <Input placeholder="Username" onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Label>Profile image: {imgPrecentage ? imgPrecentage + "%" : ""}</Label>
        <ImageInput type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <Button onClick={handleSignup} disabled={!imageUrl}>
          Sign up
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Signin;
