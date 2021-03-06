import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { SystemActionTypes, UPDATE_SESSION } from '@redux/store/system/ActionTypes';

import useAxios from 'axios-hooks';
import { Redirect } from 'react-router';
import {
  Button, Grid, TextField, Typography,
} from '@material-ui/core';
import { useCookies } from 'react-cookie';

export default function Register() {
  const dispatch = useDispatch<Dispatch<SystemActionTypes>>();
  const [, setCookie] = useCookies(['token', 'username']);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [hasUsername, setHasUsername] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);

  const [
    {
      data: postRegisterData,
      loading: postRegisterLoading,
      error: postRegisterError,
    },
    executePost,
  ] = useAxios(
    {
      method: 'POST',
      url: '/users',
    },
    { manual: true },
  );

  // callback
  useEffect(() => {
    if (postRegisterData) {
      try {
        const { token } = postRegisterData;
        setCookie('token', token, { path: '/' });
        setCookie('username', username, { path: '/' });
        dispatch({
          type: UPDATE_SESSION,
          payload: {
            username,
            session: token,
            loggedIn: !!token,
          },
        });
      } catch (error) {
        // TODO: Register error
      }
    }
  }, [postRegisterData]);

  const doRegister = () => {
    setHasUsername(!!username);
    setHasPassword(!!password);
    // return to avoid conflicts
    if (!username || !password) return;
    executePost({
      data: {
        username,
        password,
      },
    });
  };

  if (postRegisterData) return <Redirect to="/" push />;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}
    >

      <Grid item>
        <Typography variant="h4" gutterBottom>Register:</Typography>
      </Grid>

      <Grid item>
        <TextField
          variant="outlined"
          error={!hasUsername}
          helperText={!hasUsername ? 'can\'t be empty' : undefined}
          type="text"
          placeholder="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Grid>

      <Grid item>
        <TextField
          variant="outlined"
          error={!hasPassword}
          helperText={!hasPassword ? 'can\'t be empty' : undefined}
          type="password"
          placeholder="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          type="button"
          onClick={() => doRegister()}
        >
          { !postRegisterLoading && !postRegisterError ? 'Send' : null}
          { postRegisterLoading ? ('Loading') : null}
          { postRegisterError ? ('Error!') : null}
        </Button>
      </Grid>

    </Grid>
  );
}
