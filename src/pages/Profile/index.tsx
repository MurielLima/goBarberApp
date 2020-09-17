import React, { useCallback, useRef } from '../ResetPassword/node_modules/react';
import logoImg from '../../assets/logo.svg';
import { Container, Content  } from './styles';
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
import { useAuth } from '../../hook/auth';
interface ProfileFormData{
  name: string;
  email:string;
  password:string;
  old_password:string;
  password:string;
  password_confirmation:string;  
}
const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast();
  const history = useHistory();
  const {user, updateUser} = useAuth();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        ols_password: Yup.string(),
        password: Yup.string().when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string()
        }),
        password_confirmation: Yup.string().when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string()
        }).oneOf(
          [Yup.ref('password'),null],'Confirmação incorreta'
        ),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

    const { name, email, old_password, password, password_confirmation} = data;

      const formData = Object.assign({
        name: data.name,
        email: data.email,
      }, data.old_password ?{
        old_password,
        password,
        password_confirmation
      }: {})
      await api.post('/session', data);
      addToast({
        title:'Perfil atualizado com sucesso',
        description:'Suas informações do perfil foram atualizadas com sucesso!!',
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
  const handleAvatarChange = useCallback((e: ChangeElement<HTMLInputElement>)=>{
    if(e.target.files){
      const data = new FormData();
      data.append('avatar', e.target.files[0]);
      api.patch('/users/avatar',data).then(()=>{
        updateUser(response.data);
        addToast({
          type:'success',
          title: 'Avatar atualizado com sucesso!'
        });
      })
    }
  },[addToast, updateUser]);
  return (
    <Container>
      <header>
        <div>
      <Link to="/dashboard">
          <FiArrowLeft />
          Voltar
        </Link>
        </div>
      </header>
      <Content>
        <Form initialData={{
          name:user.name,
          email: user.email,
        }}ref={formRef} onSubmit={handleSubmit}>         
         <AvatarInput>
          <img src={user.avatar_url} alt={user.name}/>
          <label htmlFor="avatar">
            <FiCamera/>
            <input type="file" id="avatar" onChange={handleAvatarChange}/>
            <label/>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          <Input
            containerStyle={{margin-top:24px;}}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
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
            placeholder="Confime sua nova senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      </Content>
    </Container>
  );
};

export default Profile;
