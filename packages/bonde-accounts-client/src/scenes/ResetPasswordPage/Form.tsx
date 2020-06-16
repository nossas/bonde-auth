import React from 'react';
import gql from 'graphql-tag';
import {
  Button,
  ConnectedForm,
  Header,
  InputField,
  Link as LinkStyled,
  Row,
  Text
} from 'bonde-components';
import { useMutation } from 'bonde-core-tools';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const resetPasswordMutation = gql`
  mutation ResetPassword ($password: String!, $token: String!) {
    reset_password_change (password: $password, token:$token) {
      first_name,
      token
    }
  }
`;

const ResetPasswordForm = ({ token }: any) => {
  const { t } = useTranslation('auth');
  const [resetPassword] = useMutation(resetPasswordMutation);
  const history = useHistory();

  const submit = async (values: any) => {
    try {
      await resetPassword({ variables: values });
      history.push('/login');
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <>
      <Header.h2>{t('resetPassword.form.title')}</Header.h2>
      <Text>{t('resetPassword.form.subtitle')}</Text>
      <ConnectedForm initialValues={{ token }} onSubmit={submit}>
        {({ submitting }) => (
          <>
            <InputField
              name='password'
              type='password'
              label={t('resetPassword.fields.password.label')}
              hint={t('resetPassword.fields.password.hint')}
            />
            <Row spacing='between'>
              <LinkStyled component={Link} to='/login'>{t('resetPassword.form.cancel')}</LinkStyled>
              <Button type='submit' disabled={submitting}>{t('resetPassword.form.submit')}</Button>
            </Row>
          </>
        )}
      </ConnectedForm>
    </>
  )
}

export default ResetPasswordForm;