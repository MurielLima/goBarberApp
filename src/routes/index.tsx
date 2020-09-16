import React from '../pages/ResetPassword/node_modules/react';
import { Switch, Route} from '../pages/ResetPassword/node_modules/react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const Routes: React.FC = () =>{
    return (<Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
    </Switch>);
}

export default Routes;