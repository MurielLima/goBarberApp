import React from 'react';
import { Switch, Route} from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { Profile } from '../pages/Dashboard/styles';
import Dashboard from '../pages/Dashboard';
import ResetPassword from '../pages/ResetPassword';

const Routes: React.FC = () =>{
    return (<Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/dashboard" component={Dashboard} isPrivate/>
        <Route path="/profile" component={Profile} isPrivate/>
    </Switch>);
}

export default Routes;