import * as React from 'react';
import gql from 'graphql-tag';
import { Header, Row, Col } from 'bonde-components';
import { useMutation, useSession } from 'bonde-core-tools';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoginForm from './Form';

const LoginMutation = gql`
  mutation authenticate($email: String!, $password: String!){
    authenticate(email: $email, password: $password) {
      valid
      token
    }
  }
`

interface LoginPageProps {
  // Default url redirect when not exists next query params
  to: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ to }) => {
  const { login } = useSession();
  const { search } = useLocation();
  const [authenticate] = useMutation(LoginMutation);
  const { t } = useTranslation('auth');

  return (
    <Row>
      <Col>
        <Header.h1>{t('welcome.subtitle')}</Header.h1>
        <LoginForm
          onSubmit={async (values: any) => {
            try {
              const { data } = await authenticate({ variables: values });
              login(data.authenticate)
                .then(() => {
                  // Redirect form after login on session
                  const urlParams = new URLSearchParams(search);
                  const nextUrl = urlParams.get('next');
                  window.location.href = nextUrl ? nextUrl : to;
                });
            } catch (err) {
              if (err.graphQLErrors && err.graphQLErrors.filter((e: any) => e.message === 'email_password_dismatch').length > 0) {
                // return { email: 'Ops! Email ou senha incorretos' };
                return { email: t('form.authError') }
              }
              console.log('LoginFailed', err);
            }
          }}
        />
      </Col>
    </Row>
  );
}

export default LoginPage;