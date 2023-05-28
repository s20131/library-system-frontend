import './Cover.css';
import Card from '../UI/card/Card';
import { useCallback, useEffect, useState } from 'react';
import config from '../../config';

const Cover = (props) => {
  const [cover, setCover] = useState('');

  const fetchCover = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/resources/${props.resourceId}/cover`);
    if (response.ok) {
      const cover = await response.arrayBuffer();
      const contentType = response.headers.get('Content-Type')
      const coverBlob = new Blob([cover], { type: contentType })
      const coverUrl = URL.createObjectURL(coverBlob)
      setCover(coverUrl);
    }
  }, [props.resourceId]);

  useEffect(() => {
    void fetchCover();
  }, [fetchCover]);

  return (
    <Card className={`cover ${props.context}`}>
      {cover && <img src={cover} alt='resource cover' />}
    </Card>)
    ;
};

export default Cover;