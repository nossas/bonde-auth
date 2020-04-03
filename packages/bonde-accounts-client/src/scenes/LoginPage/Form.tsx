import React from 'react';
import {
  Button,
  Form,
  InputField,
  Link as LinkStyled,
  Validators
} from 'bonde-components';
import { Form as FinalForm } from 'react-final-form';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Container from '../../components/Container';

const { composeValidators, required, isEmail, min } = Validators;

interface LoginFormProps {
  onSubmit: any;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation('auth');

  return (
    <FinalForm onSubmit={onSubmit}>
      {({ handleSubmit, submitting }) => (
        <Form onSubmit={handleSubmit}>
          <InputField
            name='email'
            label={t('fields.email.label')}
            placeholder={t('fields.email.placeholder')}
            validate={composeValidators(
              required(t('fields.email.errors.isEmpty')),
              isEmail(t('fields.email.errors.isEmail'))
            )}
          />
          <InputField
            name='password'
            label={t('fields.password.label')}
            placeholder={t('fields.password.placeholder')}
            type='password'
            validate={composeValidators(
              required(t('fields.password.errors.isEmptyLogin')),
              min(6, t('fields.password.errors.min'))
            )}
          />
          <Container reverse>
            <LinkStyled component={Link} to='/auth/reset-password'>
              {t('links.forgetPassword')}
            </LinkStyled>
            <Button type='submit' disabled={submitting}>
              {t('button.submit')}
            </Button>
          </Container>
        </Form>
      )}
    </FinalForm>
  );
};

export default LoginForm;