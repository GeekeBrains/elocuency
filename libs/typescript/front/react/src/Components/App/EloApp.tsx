'use client';

import {
  EloFrontRoutesEnum,
  EloFrontRoutesType,
} from '../../Shared/EloFrontRoutesEnum';
import { ReduxWraper } from '../../Redux/AppWraper';
import { LoginForm, UserForm } from '../User';
import { EloAppRedux } from './EloAppRedux';

export function EloApp(props: { initialPage: EloFrontRoutesType }) {
  const { initialPage = EloFrontRoutesEnum.chat } = props;
  const children = {
    chat: <EloAppRedux></EloAppRedux>,
    login: <LoginForm></LoginForm>,
    'sign-up': <UserForm />,
    user: <UserForm></UserForm>,
  };
  return <ReduxWraper>{children[initialPage]}</ReduxWraper>;
}
