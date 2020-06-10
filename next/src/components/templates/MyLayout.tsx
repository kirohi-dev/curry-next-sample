import * as React from 'react';
import { GlobalNav } from '~/components/organisms/GlobalNav';

type Props = {
  children?: React.ReactNode,
};

export const MyLayout = (props: Props) => (
  <>
    <GlobalNav />
    {props.children}
  </>
)
