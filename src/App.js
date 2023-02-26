import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
import UserProvider from "./context/UserContext";
import Search from "./pages/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/app.css";
import Style, { useStyle } from "./context/Style";

const MainContainer = styled.div``;

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  min-height: calc(100vh - 62px);
  position: fixed;
  top: 62px;
  bottom: 0;
  right: 0;
  overflow: auto;
  width: calc(100vw - 220px);
`;

const Wrapper = styled.div`
  padding: 30px 60px;
`;

const App = () => {

  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      <UserProvider>
        <Style>
          <BrowserRouter>
            <MainContainer>
              <Navbar />
              <Container>
                <Menu darkMode={darkMode} setDarkMode={setDarkMode} className="nav_main"/>
                <Main className="app_main">
                  <Wrapper className="app_wrapper">
                    <Routes>
                      <Route path="/">
                        <Route index element={<Home type="random" />} />
                        <Route path="trends" element={<Home type="trend" />} />
                        <Route
                          path="subscriptions"
                          index
                          element={<Home type="sub" />}
                        />
                        <Route path="search" index element={<Search />} />
                        <Route path="signin" element={<Signin />} />
                        <Route path="video">
                          <Route path=":id" element={<Video />} />
                        </Route>
                      </Route>
                    </Routes>
                  </Wrapper>
                </Main>
              </Container>
            </MainContainer>
          </BrowserRouter>
        </Style>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
