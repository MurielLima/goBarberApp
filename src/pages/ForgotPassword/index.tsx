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
interface ForgotPasswordFormData {
  email: string;
}
const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        setLoading(true);
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido')
        });
        await schema.validate(data, {
          abortEarly: false,
        });

await api.post('/password/forgot',{
  email: data.email
})
        addToast({
          title:'E-mail de recuperação de senha',
          description:'Enviamos um e-mail para confirmar a recuperação de senha, verifique sua caixa de entrada',
          type: 'success'
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.log(err);
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      }finally{
        setLoading(false);
      }
    },
    [ForgotPassword, addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <img src={logoImg} alt="GoBarber" />
          <h1>Recuperar senha</h1>
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Button loading={!!loading} type="submit">Recuperar</Button>
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

export default ForgotPassword;
