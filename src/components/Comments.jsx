import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "../context/UserContext";
import Comment from "./Comment";
import ChannelImg from "./../assets/images/2.png"

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.hr};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({videoId}) => {

  const {user} = useUser();
  const [ comments, setComments ] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try{
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchComments();
  },[videoId])

  return (
    <Container>
      <NewComment>
        <Avatar src={user?.img || ChannelImg} referrerPolicy="no-referrer"/>
        <Input placeholder="Add a comment..." />
      </NewComment>
      {comments?.map(comment => (
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;
