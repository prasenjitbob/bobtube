import {
  AddTaskOutlined,
  ReplyOutlined,
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comments from "../components/Comments";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { useUser } from "../context/UserContext";
import Recommendation from "../components/Recommendation";
import { toast } from "react-toastify";
import "./../styles/video.css";

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 25px;
`;

const Content = styled.div`
width: 100%
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 500;
  margin: 18px 0 12px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 70px;
  margin: 10px 0 15px;
`;

const Info = styled.span`
  font-size: 15px;
  // color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 15px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.hr};
  padding: 15px 15px 0 15px;
  margin-bottom: 20px;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;

const Description = styled.p`
  margin: 15px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Subscribe = styled.button`
  background-color: #3ea6ff;
  font-size: 15px;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const CommentsCount = styled.p`
  margin: 20px 0;
`;

const Video = () => {
  const { id } = useParams();
  const { user, setUser } = useUser();
  const [video, setVideo] = useState({});
  const [likeCount, setLikeCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${id}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setVideo(videoRes.data);
        setLikeCount(videoRes.data.likes?.length);
        setChannel(channelRes.data);
        setIsLiked(videoRes.data?.likes?.includes(user?._id));
        setIsDisliked(videoRes.data?.dislikes?.includes(user?._id));
        setIsSubscribed(user?.subscribedUsers?.includes(channelRes.data?._id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, user]);
  console.log(user);
  const handleLike = async () => {
    if(!user) return toast.info("Sign in to like the video.");
    await axios.put(`/users/like/${video._id}`);
    if (isLiked) return;
    setLikeCount(likeCount + 1);
    setIsLiked(true);
    setIsDisliked(false);
  };

  const handleDislike = async () => {
    if(!user) return toast.info("Sign in to dislike the video.");
    await axios.put(`/users/dislike/${video._id}`);
    if (isDisliked) return;
    if(isLiked) setLikeCount(likeCount - 1);
    setIsDisliked(true);
    setIsLiked(false);
  };

  const subscribe = async () => {
    if(!user) return toast.info("Sign in to subscribe the channel.");
    if (!isSubscribed) {
      await axios.put(`/users/sub/${channel._id}`);
      setIsSubscribed(!isSubscribed);
      setUser({
        ...user,
        subscribedUsers: [...user.subscribedUsers, channel._id],
      });
    } else {
      await axios.put(`/users/unSub/${channel._id}`);
      setIsSubscribed(!isSubscribed);
      const newSubscribedUsersArray = user?.subscribedUsers?.filter(
        (userId) => userId !== channel._id
      );
      setUser({
        ...user,
        subscribedUsers: newSubscribedUsersArray,
      });
    }
  };

  return (
    <Container className="video_container">
      <Content>
        <VideoWrapper>
          <VideoFrame src={video.videoUrl} controls poster={video.imgUrl} autoPlay/>
        </VideoWrapper>
        <Title>{video?.title}</Title>
        <Description>{video?.description}</Description>
        <Details className="video_details">
          <Info>
            {format(video?.createdAt)}
          </Info>
          <Buttons className="video_buttons">
            <Button onClick={handleLike}>
              {isLiked ? <ThumbUp /> : <ThumbUpOutlined />} {likeCount}
            </Button>
            <Button onClick={handleDislike}>
              {isDisliked ? <ThumbDown /> : <ThumbDownOutlined />} Dislike
            </Button>
            <Button>
              <ReplyOutlined /> Share
            </Button>
            <Button>
              <AddTaskOutlined /> Save
            </Button>
          </Buttons>
        </Details>
        {/* <Hr /> */}
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
            </ChannelDetail>
          </ChannelInfo>
          {user?._id !== video.userId ? <Subscribe onClick={subscribe}>
            {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
          </Subscribe> : null}
        </Channel>
        {/* <Hr /> */}
        <CommentsCount>122 Comments</CommentsCount>
        <Comments videoId={video._id}/>
      </Content>
      <Recommendation tags={video.tags} videoId={video._id}/>
    </Container>
  );
};

export default Video;
