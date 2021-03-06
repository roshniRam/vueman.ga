import { register, loginPromise } from "../../api/authAPI";
import { profilePromise } from "../../api/profileAPI";
import setAuthHeader from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

const state = {
  user: {},
  loggedIn: false
};

// Adding getter
const getters = {
  loggedIn: (state, getters, rootState) => {
    return state.loggedIn;
  },
  currentUser: (state, getters, rootState) => {
    return state.user;
  }
};

// Actions
const actions = {
  signup({ commit, state }, payload) {
    register(payload)
      .then(res => {
        console.log(res.data.user);
        commit("userSignedUp", res.data.user);
      })
      .catch(err => console.log(err));
  },
  login({ commit, state }, payload) {
    loginPromise(payload)
      .then(res => {
        const { token } = res.data;
        console.log(token);
        localStorage.setItem("jwtToken", token);
        // setAuthHeader(token);
        const decoded = jwt_decode(token);
        profilePromise(decoded.username).then(res => {
          commit("userLogin", res.data.user);
        });
        // commit("userLogin", decoded);
      })
      .catch(err => console.log(err));
  },
  logout({ commit, state }) {
    localStorage.removeItem("jwtToken");
    setAuthHeader(false);
    commit("userLogout");
  },
  saveUser({ commit, state }, token) {
    const decoded = jwt_decode(token);
    profilePromise(decoded.username).then(res => {
      commit("userLogin", res.data.user);
    });
    commit("userLogin", decoded);
  }
};

// mutations

const mutations = {
  userSignedUp(state, user) {
    state.user = user;
    state.loggedIn = true;
  },
  userLogin(state, user) {
    state.user = user;
    state.loggedIn = true;
  },
  userLogout(state) {
    state.user = {};
    state.loggedIn = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
