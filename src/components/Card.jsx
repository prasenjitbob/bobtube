import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Img from "./../assets/images/maxresdefault.jpg";
import ChannelImg from "./../assets/images/2.png";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import "./../styles/card.css";
import { baseURL } from "../config";

const Container = styled.div`
  // width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => props.type === "sm" && "10px"};
  cursor: pointer;
  background-color: ${({ theme, type }) => type !== "sm" && theme.bgLighter};
  border-radius: 5px;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
  flex-wrap: wrap;
  box-shadow: rgb(149 157 165 / 20%) 0px 8px 24px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "220px")};
  min-height: ${(props) => (props.type === "sm" ? "100px" : "200px")};
  background-color: #999;
  border-radius: ${(props) => (props.type === "sm" ? "3px" : "5px 5px 0 0")};
  object-fit: cover;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  gap: 12px;
  padding: ${(props) => props.type !== "sm" && "15px"};
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Text = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Info = styled.div`
  display: flex;
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Description = styled.p`
  margin: 8px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`${baseURL}/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image src={video.imgUrl} type={type} alt="" className="card_img" />
        <Details type={type} className="card_details">
          <ChannelImage src={channel.img || ChannelImg} type={type} />
          <Text>
            <Title>{video.title}</Title>
            <Description>{video.description.substr(0, 50)}...</Description>
            {/* <ChannelName>{channel.name}</ChannelName> */}
            <Info>
              <ChannelName>{channel.name}:</ChannelName>&nbsp;
              {format(video.createdAt)}
            </Info>
          </Text>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
