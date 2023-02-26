import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import { baseURL } from "../config";
import { useUser } from "../context/UserContext";
import ChannelImg from "./../assets/images/2.png";

const Container = styled.div`
  display: flex;
  gap: 15px;
  margin: 30px 0;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Date = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Comment = ({ comment }) => {
  const { login } = useUser();
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`${baseURL}/users/find/${comment.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [comment.userId]);

  return (
    <Container onClick={login}>
      <Avatar src={channel.img || ChannelImg} referrerPolicy="no-referrer" />
      <Details>
        <Name>
          {channel.name} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.description}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
