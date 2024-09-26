// src/components/YouTubePreview.js

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';


const YouTubePreview = ({ url }) => {
  const [videoId, setVideoId] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);

  // 유튜브 비디오 ID 추출 함수
  const extractYouTubeVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      let id = '';

      if (urlObj.hostname === 'youtu.be') {
        id = urlObj.pathname.slice(1);
      } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        if (urlObj.searchParams.get('v')) {
          id = urlObj.searchParams.get('v');
        } else if (urlObj.pathname.startsWith('/embed/')) {
          id = urlObj.pathname.split('/embed/')[1];
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          id = urlObj.pathname.split('/shorts/')[1];
        }
      }

      // 추가 파라미터 제거
      if (id.includes('&')) {
        id = id.split('&')[0];
      }
      if (id.includes('?')) {
        id = id.split('?')[0];
      }

      return id;
    } catch (err) {
      console.error(`Invalid URL: ${url}`, err);
      return null;
    }
  };

  // 유튜브 동영상 정보 가져오기
  const fetchYouTubeVideoInfo = async (id) => {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;

    try {
      const response = await fetch(oEmbedUrl);
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title,
          thumbnailUrl: data.thumbnail_url,
          authorName: data.author_name,
        };
      } else {
        console.error('Failed to fetch video info');
        return null;
      }
    } catch (err) {
      console.error('Error fetching video info:', err);
      return null;
    }
  };

  useEffect(() => {
    const id = extractYouTubeVideoId(url);
    if (id) {
      setVideoId(id);
      fetchYouTubeVideoInfo(id).then((info) => {
        if (info) {
          setVideoInfo(info);
        } else {
          setError('비디오 정보를 가져오는 데 실패했습니다.');
        }
      });
    } else {
      setError('유효하지 않은 유튜브 링크입니다.');
    }
  }, [url]);

  if (error) {
    return <div className="youtube-error">{error}</div>;
  }

  if (!videoId || !videoInfo) {
    return <div className="youtube-loading">Loading...</div>;
  }

  return (
    <div className="youtube-preview">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={videoInfo.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="youtube-info">
        <p><strong>{videoInfo.title}</strong></p>
        <p>By {videoInfo.authorName}</p>
      </div>
    </div>
  );
};

YouTubePreview.propTypes = {
  url: PropTypes.string.isRequired,
};

export default YouTubePreview;
