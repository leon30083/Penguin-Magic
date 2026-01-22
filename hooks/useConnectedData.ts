import { useEffect, useState } from 'react';
import { CanvasNodeData } from '../components/Canvas';

/**
 * 连接数据同步 Hook (从 WinJin 移植)
 * 自动从 node.data 同步角色和图片连接数据到组件状态
 *
 * @param data - Canvas 节点的 data 对象
 * @returns { connectedCharacters, setConnectedCharacters, connectedImages, setConnectedImages }
 */
export function useConnectedData(data: CanvasNodeData) {
  // 角色连接状态
  const [connectedCharacters, setConnectedCharacters] = useState<any[]>(
    (data.connectedCharacters as any[]) || []
  );

  // 图片连接状态
  const [connectedImages, setConnectedImages] = useState<any[]>(
    (data.connectedImages as any[]) || []
  );

  // 同步 connectedCharacters 从 data 到 state
  useEffect(() => {
    if (data.connectedCharacters !== undefined) {
      setConnectedCharacters(data.connectedCharacters as any[]);
    } else {
      setConnectedCharacters([]);
    }
  }, [data.connectedCharacters]);

  // 同步 connectedImages 从 data 到 state
  // 关键修复：当 data.connectedImages 为 undefined 时（连接断开），清除状态
  useEffect(() => {
    if (data.connectedImages !== undefined) {
      setConnectedImages(data.connectedImages as any[]);
    } else {
      setConnectedImages([]);
    }
  }, [data.connectedImages]);

  return {
    connectedCharacters,
    setConnectedCharacters,
    connectedImages,
    setConnectedImages,
  };
}
