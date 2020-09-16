import React, { useCallback, useRef } from '../ResetPassword/node_modules/react';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import { FiLogIn, FiMail, FiLock, FiUser, FiArrowLeft } from '../ResetPassword/node_modules/react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '../ResetPassword/node_modules/@unform/core';
import { Form } from '../ResetPassword/node_modules/@unform/web';
import * as Yup from '../ResetPassword/node_modules/yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link,useHistory } from '../ResetPassword/node_modules/react-router-dom';
import { useToast } from '../../hook/toast';
import api from '../../services/api';
interface SignUpFormData{
  name: string;
  email:string;
  password:string;  
}
const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Mínimo 6 caracteres'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/session', data);
      addToast({
        title:'Conta cadastrada com sucesso',
        description:'Você será redirecionado para fazer seu primeiro login',
        type: 'success'
      });
      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        title:'Erro ao cadastrar conta',
        description:'Houve um erro ao cadastrar os dados',
        type: 'error'
      });
    }
  }, []);
  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <img src={logoImg} alt="GoBarber" />
          <h1>Faça seu cadastro</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <Link to="/">
          <FiArrowLeft />
          Voltar
        </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
