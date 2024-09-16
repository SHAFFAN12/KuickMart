import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url, event, callback) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url);
    }

    const handleEvent = (data) => {
      callback(data);
    };

    socketRef.current.on(event, handleEvent);

    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, handleEvent);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url, event, callback]);
};

export default useSocket;
