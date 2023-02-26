import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  width: 100%;
`;

const Recommendation = ({ tags, videoId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      const videosExcSelf = res.data.filter((video) => video._id !== videoId);
      setVideos(videosExcSelf);
    };
    fetchVideos();
  }, [tags, videoId]);
  
  return (
    <Container>
      {videos?.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;
