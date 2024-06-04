import { useEffect, useState } from "react";

export const useIdentity = () => {
  const [deviceId, setDeviceId] = useState<string>("");

  useEffect(() => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(7);
      localStorage.setItem("deviceId", deviceId);
    }
    setDeviceId(deviceId);
  }, []);

  return deviceId;
};
