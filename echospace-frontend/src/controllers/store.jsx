import { createStore, createHook, defaults } from "react-sweet-state";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

defaults.devtools = true;

const initialState = {
  isLoggedIn: undefined,
  user: null,
  error: null,
  isLoading: false,
};

const actions = {
  setLoading:
    (isLoading) =>
    ({ setState }) => {
      setState({ isLoading });
    },
  signUp:
    ({ auth, email, password, name, mobileNumber }) =>
    async ({ setState }) => {
      setState({ isLoading: true });
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(auth.currentUser, { displayName: name });
        setState({
          isLoggedIn: true,
          user: { email: userCredential.user.email, name, mobileNumber },
          error: null,
        });
      } catch (error) {
        setState({ error: error.message });
      } finally {
        setState({ isLoading: false });
      }
    },
  signIn:
    ({ auth, email, password }) =>
    async ({ setState }) => {
      console.log(auth, email, password);
      setState({ isLoading: true });
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setState({
          isLoggedIn: true,
          user: userCredential.user.email,
          error: null,
        });
      } catch (error) {
        setState({ error: error.message });
      } finally {
        setState({ isLoading: false });
      }
    },
  logOut:
    ({ auth }) =>
    async ({ setState }) => {
      setState({ isLoading: true });
      try {
        await signOut(auth);
        setState({ isLoggedIn: false, user: null, error: null });
      } catch (error) {
        setState({ error: error.message });
      } finally {
        setState({ isLoading: false });
      }
    },
  updateCurrentUser:
    (user) =>
    ({ setState }) => {
      if (!!user) {
        setState({ isLoggedIn: true, user });
      } else {
        setState({ isLoggedIn: false, user });
      }
    },
};

const Store = createStore({
  initialState,
  actions,
  name: "echospace",
});

export const useEchospace = createHook(Store);
