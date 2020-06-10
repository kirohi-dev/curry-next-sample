import React from 'react';
import { NextComponentType, NextPageContext } from 'next';
import styled from 'styled-components';
import { ImageObj } from '../../modules/domain/model/Curry';

type Props = {
  className?: string;
  children?: React.ReactNode;
}

const Curry: NextComponentType<NextPageContext, {}, Props> = props => (
<ul className={props.className}>{ props.children }</ul>
)

const CurryUl = styled(Curry)`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const CurryLi = styled.li`
  margin: 12px;
`;

const CurryImg = styled.img`
  display: block;
  width: 300px;
  height: 300px;
  object-fit: cover;
`;

const CurryName = styled.span`
  color: #e65100;
  font-size: 14px;
`;

export const CurryList = (props: { curries: ImageObj[]}) => (
  <CurryUl>
    {props.curries.map(curry => (
      <CurryLi>
        <CurryName>(curry.name)</CurryName>
        <CurryImg src={curry.imageUrl} />
      </CurryLi>
    ))}
  </CurryUl>
);
