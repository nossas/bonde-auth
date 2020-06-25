import React, { useState } from 'react';
import gql from 'graphql-tag'
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';
import { useSession, useMutation } from 'bonde-core-tools';
import { Button, ConnectedForm, InputField, Header, Link as LinkStyled, Hint, Validators } from 'bonde-components';
import Container from '../../components/Container';

const { composeValidators, required, min } = Validators;

const registerUserMutation = gql`
  mutation Register ($input: RegisterInput!) {
    register(input: $input) {
      first_name
      token
    }
  }
`

const Styles = styled.div`
  & > span {
    display: block;
    margin-bottom: 15px;
    text-align: right;
  }
`

const RegisterForm = ({ to, t }: any) => {
  const { search } = useLocation();
  const { login } = useSession();
  const [error, setError] = useState(undefined);
  const [registerUser] = useMutation(registerUserMutation);

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const email = urlParams.get('email');

  return (
    <>
      <Header.h1>{t('welcome.subtitle')}</Header.h1>
      <ConnectedForm
        initialValues={{ input: { email, code } }}
        onSubmit={async (values: any) => {
          try {
            const { data } = await registerUser({ variables: values })
            login(data.register)
              .then(() => {
                window.location.href = to;
              })
          } catch (err) {
            if (err && err.message && err.message.indexOf('invalid_invitation_code') !== -1) {
              setError(t('form.register.token.invalid'))
              console.log('err', err)
            }
            console.log('RegisterFailed', err)
          }
        }}
      >
        {({ submitting }: any) => (
          <Styles>
            {error && <Hint color='error'>{error}</Hint>}
            <Container column>
              <InputField
                name='input.first_name'
                label={t('fields.firstName.label')}
                placeholder={t('fields.firstName.placeholder')}
                validate={required(t('fields.firstName.errors.isEmpty'))}
              />
              <InputField
                name='input.last_name'
                label={t('fields.lastName.label')}
                placeholder={t('fields.lastName.placeholder')}
                onBlur={required(t('fields.lastName.errors.isEmpty'))}
              />
            </Container>
            <InputField
              disabled
              name='input.email'
              label={t('fields.email.label')}
              placeholder={t('fields.email.placeholder')}
            />
            <InputField
              type='password'
              name='input.password'
              label={t('fields.password.label')}
              placeholder={t('fields.password.placeholder')}
              validate={composeValidators(
                required(t('fields.password.errors.isEmptyRegister')),
                min(6, t('fields.password.errors.min'))
              )}
            />
            <Container reverse>
              <LinkStyled to='/login' component={Link}>
                {t('links.iHaveAccount')}
              </LinkStyled>
              <Button type='submit' disabled={submitting}>
                {t('button.submit')}
              </Button>
            </Container>
          </Styles>
        )}
      </ConnectedForm>
    </>
  );
};

export default RegisterForm;
