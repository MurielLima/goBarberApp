import React, { useEffect } from '../../../pages/ResetPassword/node_modules/react';
import { Container } from './styles';
import { FiAlertCircle, FiXCircle } from '../../../pages/ResetPassword/node_modules/react-icons/fi';
import { ToastMessage, useToast } from '../../../hook/toast';

interface ToastProps{
    data: ToastMessage;
    style: object;
}
const Toast: React.FC<ToastProps> = ({ data, style }) => {
  const { removeToast } = useToast();
  useEffect(()=>{
    setTimeout(()=>{
      removeToast(data.id);
    },3000);
  },[]);
  return (
    <Container type={data.type} hasDescription={!!data.description} style={style}>
      <FiAlertCircle size={20} />
      <strong>{data.title}</strong>
      <div>
        {data.description && <p>{data.description}</p>}
        <button onClick={() => removeToast(data.id)} type="button">
          <FiXCircle size={18} />
        </button>
      </div>
    </Container>
  );
};

export default Toast;
