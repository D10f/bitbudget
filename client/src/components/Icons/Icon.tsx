import React from "react";
import svgSprite from '../../assets/sprite.svg';

interface IconProps {
  color?: string;
  name: string;
}

const Icon = ({ color = "#2f3136", name }: IconProps) => (
  <svg aria-hidden="true" fill={color}>
    <use xlinkHref={`${svgSprite}#icon-${name}`}></use>
  </svg>
);

export default Icon;
