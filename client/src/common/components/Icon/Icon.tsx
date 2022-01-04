import React from "react";
import svgSprite from "@assets/sprite.svg";

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => (
  <svg aria-hidden="true" className={className}>
    <use xlinkHref={`${svgSprite}#icon-${name}`}></use>
  </svg>
);

export default Icon;
