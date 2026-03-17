import React, { useState, useEffect, useCallback } from 'react';

interface ScaleOptions {
  /** 设计稿宽度 */
  designWidth: number;
  /** 设计稿高度 */
  designHeight: number;
  /** 缩放模式: 'contain' 保持比例完整显示, 'cover' 保持比例填充, 'stretch' 拉伸填充 */
  mode?: 'contain' | 'cover' | 'stretch';
}

interface ScaleResult {
  scale: number;
  scaleX: number;
  scaleY: number;
  containerStyle: React.CSSProperties;
  contentStyle: React.CSSProperties;
}

/**
 * 页面缩放 Hook
 * 根据窗口大小自动缩放内容，保持设计稿比例
 */
export function useScale(options: ScaleOptions): ScaleResult {
  const { designWidth, designHeight, mode = 'contain' } = options;

  const calculateScale = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / designWidth;
    const scaleY = windowHeight / designHeight;

    let scale: number;

    switch (mode) {
      case 'contain':
        // 保持比例，完整显示
        scale = Math.min(scaleX, scaleY);
        break;
      case 'cover':
        // 保持比例，填满窗口
        scale = Math.max(scaleX, scaleY);
        break;
      case 'stretch':
        // 拉伸填充（不推荐，会变形）
        scale = 1;
        break;
      default:
        scale = Math.min(scaleX, scaleY);
    }

    return { scale, scaleX, scaleY };
  }, [designWidth, designHeight, mode]);

  const [scaleState, setScaleState] = useState(() => calculateScale());

  useEffect(() => {
    const handleResize = () => {
      setScaleState(calculateScale());
    };

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 初始计算
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateScale]);

  // 容器样式 - 用于包裹缩放内容
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // 内容样式 - 应用缩放
  const contentStyle: React.CSSProperties = {
    width: `${designWidth}px`,
    height: `${designHeight}px`,
    transform:
      mode === 'stretch'
        ? `scaleX(${scaleState.scaleX}) scaleY(${scaleState.scaleY})`
        : `scale(${scaleState.scale})`,
    transformOrigin: 'center center',
    flexShrink: 0,
  };

  return {
    scale: scaleState.scale,
    scaleX: scaleState.scaleX,
    scaleY: scaleState.scaleY,
    containerStyle,
    contentStyle,
  };
}

export default useScale;
