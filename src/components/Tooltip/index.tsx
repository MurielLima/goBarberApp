import React from 'react';
import { Container } from './styles';
interface InterfaceProps{
    title:string;
    className?: string;
}
const Tooltip : React.FC<InterfaceProps> = ({title, className = '', children}) =>{
return (
    <Container className={className}>
        {children}
        <span>{title}</span>
    </Container>
);
};

export default Tooltip;