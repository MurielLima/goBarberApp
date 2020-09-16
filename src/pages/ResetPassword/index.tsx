import React, { useRef, useCallback, useContext } from '../ResetPassword/node_modules/react';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import { FiLogIn, FiMail, FiLock } from '../ResetPassword/node_modules/react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Form } from '../ResetPassword/node_modules/@unform/web';
import { FormHandles } from '../ResetPassword/node_modules/@unform/core';
import * as Yup from '../ResetPassword/node_modules/yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hook/auth';
import { useToast } from '../../hook/toast';
import { Link, useHistory } from '../ResetPassword/node_modules/react-router-dom';
import api from '../../services/api';
interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}
const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        const {password, password_confirmation} = data;
        const token = location.search.replace('?token=','');
        await api.post('/password/reset',{
          password,
          password_confirmation,
          token
        })
        addToast({
          title:'Reset de senha feito com sucesso!',
          type: 'success'
        });
        history.push('/signin');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.log(err);
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no reset de senha',
          description: 'Ocorreu um erro ao fazer reset de senha.',
        });
      }
    },
    [ResetPassword, addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <img src={logoImg} alt="GoBarber" />
          <h1>Resetar senha</h1>
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmação da senha"
          />
          <Button type="submit">Alterar senha</Button>
        </Form>
        <Link to="/signin">
          <FiLogIn />
          Voltar ao login
        </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
