import React from 'react';
import { useScale } from '../../hooks/useScale';
import styles from './ScaleContainer.module.css';

interface ScaleContainerProps {
  children: React.ReactNode;
  /** 设计稿宽度，默认 1920 */
  designWidth?: number;
  /** 设计稿高度，默认 1080 */
  designHeight?: number;
  /** 缩放模式，默认 'contain' */
  mode?: 'contain' | 'cover' | 'stretch';
  /** 背景色 */
  backgroundColor?: string;
}

/**
 * 缩放容器组件
 * 自动根据窗口大小缩放内容，保持设计稿比例
 */
export const ScaleContainer: React.FC<ScaleContainerProps> = ({
  children,
  designWidth = 1920,
  designHeight = 1080,
  mode = 'contain',
  backgroundColor = 'var(--color-background, #ffffff)',
}) => {
  const { scale, containerStyle, contentStyle } = useScale({
    designWidth,
    designHeight,
    mode,
  });

  return (
    <div className={styles.container} style={{ ...containerStyle, backgroundColor }}>
      <div
        className={styles.content}
        style={{
          ...contentStyle,
          backgroundColor,
        }}
        data-scale={scale.toFixed(3)}
      >
        {children}
      </div>
    </div>
  );
};

export default ScaleContainer;
