import styled from "styled-components";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ChannelImg from "./../assets/images/2.png"
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  AccountCircleOutlined,
  VideoCallOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./../styles/menu.css";
import { useStyle } from "../context/Style";
import { useState, useRef, useEffect } from "react";
import Upload from "./Upload";

const Container = styled.div`
  flex: 1.1;
  background-color: ${({ theme }) => theme.bgLighter};
  min-height: calc(100vh - 62px);
  color: ${({ theme }) => theme.text};
  position: fixed;
  width: 220px;
  top: 62px;
  bottom: 0;
  overflow: scroll;
  z-index: 10;
`;

const Wrapper = styled.div`
  padding: 8px 20px 70px;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
  }
`;

const Items = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 15px 0;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.hr};
    padding-left: 10px;
    border-radius: 5px;
    gap: 15px;
  }
`;

const UserItems = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 10px;
  font-weight: 500;
  transition: 0.3s;
  border: 1px solid ${({ theme }) => theme.hr};
  background-color: ${({ theme }) => theme.hr};
  border-radius: 5px;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.hr};
`;

const Login = styled.div`
  font-weight: 500;
  margin: 25px 0;
`;
const Button = styled.button`
  background-color: transparent;
  padding: 5px 15px;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500px;
  color: #aaaaaa;
  margin: 15px 0;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const MenuContainer = styled.div``;

const Menu = ({ darkMode, setDarkMode }) => {
  const ref = useRef(null);
  const { user, logout } = useUser();
  const { navIsOpen, setNavIsOpen } = useStyle();
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    if (navIsOpen) {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setNavIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [ref, navIsOpen]);

  const showUploadModal = () => {
    document.body.style.overflow = "hidden";
    setOpenUpload(true);
    setNavIsOpen(false);
  };

  return (
    <>
      {/* {navIsOpen && <div className="backdrop"></div>} */}
      <Container
        className={navIsOpen ? "show_menu_container" : "menu_container"}
        ref={ref}
      >
        <Wrapper>
          <MenuContainer>
            <Link to="/">
              <Items>
                <HomeIcon />
                Home
              </Items>
            </Link>
            <Link to="trends">
              <Items>
                <ExploreIcon />
                Explore
              </Items>
            </Link>
            <Link to="subscriptions">
              <Items>
                <SubscriptionsIcon />
                Subscription
              </Items>
            </Link>
            <Hr />
            <Items>
              <VideoLibraryIcon />
              Library
            </Items>
            <Items>
              <HistoryIcon />
              History
            </Items>
            <Hr />
            {user ? (
              <Items onClick={showUploadModal}>
                <VideoCallOutlined style={{ cursor: "pointer" }} />
                Upload a video
              </Items>
            ) : (
              <>
                <Login>
                  Sign in to like, comment and subscribe.
                  <Link to="signin" style={{ textDecoration: "none" }} onClick={() => setNavIsOpen(false)}>
                    <Button>
                      <AccountCircleOutlined />
                      &nbsp;SIGN IN
                    </Button>
                  </Link>
                </Login>
              </>
            )}
            <Hr />
            <Title>BEST OF BoB</Title>
            <Items>
              <SettingsIcon />
              Setting
            </Items>
            <Items>
              <HelpIcon />
              Help
            </Items>
            <Items onClick={() => setDarkMode(!darkMode)}>
              <LightModeIcon />
              {darkMode ? "Light" : "Dark"} Mode
            </Items>
            {user && (
              <>
                {" "}
                <Hr />
                <Items onClick={() => logout()}>
                  <PowerSettingsNew />
                  &nbsp;Logout
                </Items>
                <Hr />
              </>
            )}
            {user && (
              <UserItems>
                <Avatar src={user?.img || ChannelImg} referrerPolicy="no-referrer" />
                {user.name}
              </UserItems>
            )}
          </MenuContainer>
        </Wrapper>
      </Container>
      {openUpload && <Upload setOpen={setOpenUpload} />}
    </>
  );
};

export default Menu;
