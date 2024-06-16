import { createStore, createHook, defaults } from "react-sweet-state";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

defaults.devtools = true;

const initialState = {
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
        setState({ user: userCredential.user.email, error: null });
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
        setState({ user: null, error: null });
      } catch (error) {
        setState({ error: error.message });
      } finally {
        setState({ isLoading: false });
      }
    },
  updateCurrentUser:
    (user) =>
    ({ setState }) => {
      setState({ user });
    },
};

const Store = createStore({
  initialState,
  actions,
  name: "echospace",
});

export const useEchospace = createHook(Store);
