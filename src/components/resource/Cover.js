import './Cover.css';
import Card from '../UI/card/Card';
import { useCallback, useEffect, useState } from 'react';
import config from '../../config';

const Cover = (props) => {
  const [cover, setCover] = useState('');

  const fetchCover = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/resources/${props.resourceId}/cover`);
    if (response.ok) {
      const cover = await response.blob();
      const coverUrl = URL.createObjectURL(cover)
      setCover(coverUrl);
    }
  }, [props.resourceId]);

  useEffect(() => {
    void fetchCover();
  }, [fetchCover]);

  return (
    <Card className={`cover ${props.context}`}>
      {cover && <img src={cover} alt={`${props.title} cover`} />}
    </Card>)
    ;
};

export default Cover;