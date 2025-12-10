import { configureStore } from '@reduxjs/toolkit';
import { evaluationCreateReducer } from "./reducers/evaluationReducer";
import {
  footballeurRegisterReducer,
  footballeurSigninReducer,
  footballeurDeleteReducer,
  footballeurListReducer,
  footballeurUpdateReducer,
  footballeurDetailsReducer
} from './reducers/footballeurReducers.js';

import {
  proprietaireRegisterReducer,
  proprietaireSigninReducer,
  proprietaireUpdateReducer,
  proprietaireListReducer,
  proprietaireDeleteReducer,
} from './reducers/proprietaireReducers.js';

import {
  terrainCreateReducer,
  terrainListReducer,
  terrainDeleteReducer,
  terrainUpdateReducer,
  terrainMineReducer,
} from './reducers/terrainReducers.js';

import {
  matchCreateReducer,
  matchListReducer,
  matchJoinReducer,
  matchDetailsReducer,
  matchListMyReducer,
  matchUpdateReducer, 
  matchDeleteReducer,

} from './reducers/matchReducers.js';

import { notificationReducer } from "./reducers/notificationReducer";


 

export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      // ⚽ Footballeur
      footballeurSignin: footballeurSigninReducer,
      footballeurRegister: footballeurRegisterReducer,
      footballeurList: footballeurListReducer,
      footballeurDelete: footballeurDeleteReducer,
      footballeurUpdate: footballeurUpdateReducer,
      footballeurDetails: footballeurDetailsReducer,

      // 🏠 Propriétaire
      proprietaireSignin: proprietaireSigninReducer,
      proprietaireRegister: proprietaireRegisterReducer,
      proprietaireList: proprietaireListReducer,
      proprietaireDelete: proprietaireDeleteReducer,
      proprietaireUpdate: proprietaireUpdateReducer,

      // 🏟️ Terrains
      terrainCreate: terrainCreateReducer,
      terrainList: terrainListReducer,
      terrainMine: terrainMineReducer,
      terrainDelete: terrainDeleteReducer,
      terrainUpdate: terrainUpdateReducer,

      // ⚔️ Matchs
      matchCreate: matchCreateReducer,
      matchList: matchListReducer,
      matchJoin: matchJoinReducer,
      matchDetails: matchDetailsReducer,
      matchListMy: matchListMyReducer,
      matchUpdate: matchUpdateReducer,
      matchDelete: matchDeleteReducer,

      evaluationCreate: evaluationCreateReducer,
      notifications: notificationReducer,

    },
    preloadedState,
  });
}



