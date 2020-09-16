import React from 'react';
import { Container, Header, HeaderContent, Profile} from './styles';
import logoImg from '../../assets/logo.svg'
const Dashboard: React.FC = () =>{
    return (<Container>
        <Header>
            <HeaderContent>
                <img src={logoImg} alt="GoBarber"/>
                <Profile>
                    <img
                    src="https://avatars3.githubusercontent.com/u/11466657?s=400&u=9eda08330a3f0692fb035049ba5dacaa0a32e33e&v=4"
                    alt="R.Gat"
                    />
                    <div>
                        <span>Bem-vindo,</span>
                    <strong>R.Gat</strong>
                    </div>
                </Profile>
                <button type="button">
                    <FiPower/>
                </button>
            </HeaderContent>
        </Header>
    </Container>);
};
export default Dashboard;