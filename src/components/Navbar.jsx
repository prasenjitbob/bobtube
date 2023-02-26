import {
  AccountCircleOutlined,
  SearchOutlined,
  VideoCallOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../context/UserContext";
import Upload from "./Upload";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./../styles/navbar.css";
import { useStyle } from "../context/Style";
import ChannelImg from "./../assets/images/2.png"

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 62px;
  z-index: 11;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0px 30px;
  justify-content: flex-end;
  position: relative;
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 40%;
  padding: 7px;
  border: 1px solid #ccc;
  color: ${({ theme }) => theme.textSoft};
  border-radius: 3px;
`;
const Input = styled.input`
  outline: none;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  padding: 0 15px;
  width: 100%;
`;

const Button = styled.button`
  background-color: transparent;
  padding: 5px 15px;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500px;
  cursor: pointer;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const UserContainer = styled.div``;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
  cursor: pointer;
`;

const LogoutDropdown = styled.div`
  position: absolute;
  top: 65px;
  right: 20px;
  width: 150px;
  height: 50px;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.hr};
  border-radius: 2px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;

  &:hover {
    color: #3ea6ff;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const HamburgerMenu = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Navbar = () => {
  const { user, logout } = useUser();
  const { navIsOpen, setNavIsOpen } = useStyle();
  const navigate = useNavigate();
  const [openUpload, setOpenUpload] = useState(false);
  const [query, setQuery] = useState("");
  const [openLogout, setOpenLogout] = useState(false);

  const showUploadModal = () => {
    document.body.style.overflow = "hidden";
    setOpenUpload(true);
  };

  const logoutHandler = () => {
    setOpenLogout(false);
    logout();
  };

  const submitSearch = () => {
    navigate(`/search?q=${query}`);
  };

  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <>
      <Container>
        <Wrapper className="navbar_wrapper">
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo className="navbar_logo">
              <YouTubeIcon style={{ fontSize: "50px", color: "#3ea6ff" }} />
              BoBTube
            </Logo>
          </Link>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => keyDownHandler(e)}
            />
            <SearchOutlined
              style={{ cursor: "pointer" }}
              onClick={submitSearch}
            />
          </Search>
          <UserContainer className="user_container">
            {user ? (
              <User>
                <VideoCallOutlined
                  onClick={showUploadModal}
                  style={{ cursor: "pointer" }}
                />
                <Avatar
                  src={user?.img || ChannelImg}
                  referrerPolicy="no-referrer"
                  onClick={() => setOpenLogout(!openLogout)}
                />
                {user.name}
              </User>
            ) : (
              <Link to="signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlined />
                  &nbsp;SIGN IN
                </Button>
              </Link>
            )}
          </UserContainer>
          <HamburgerMenu>
            {!navIsOpen ? (
              <MenuIcon
                className="menu_icon"
                onClick={() => setNavIsOpen(true)}
              />
            ) : (
              <CloseIcon
                className="close_icon"
                onClick={() => setNavIsOpen(false)}
              />
            )}
          </HamburgerMenu>
          {openLogout && (
            <LogoutDropdown onClick={logoutHandler}>
              <PowerSettingsNew />
              &nbsp;Logout
            </LogoutDropdown>
          )}
        </Wrapper>
      </Container>
      {openUpload && <Upload setOpen={setOpenUpload} />}
    </>
  );
};

export default Navbar;
