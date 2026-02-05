import { configureStore } from '@reduxjs/toolkit';
import { evaluationCreateReducer } from "./reducers/evaluationReducer";
import {
  footballeurRegisterReducer,
  footballeurSigninReducer,
  footballeurDeleteReducer,
  footballeurListReducer,
  footballeurUpdateReducer,
  footballeurDetailsReducer,
  footballeurSearchReducer 
} from './reducers/footballeurReducers.js';

import {
  proprietaireRegisterReducer,
  proprietaireSigninReducer,
  proprietaireUpdateReducer,
  proprietaireListReducer,
  proprietaireDeleteReducer,
} from './reducers/proprietaireReducers.js';
import {
   equipeReducer, 
   myCaptainEquipesReducer, 
   equipeCreateReducer,
   equipeMineReducer, 
   equipeDetailsReducer,
  } from './reducers/equipeReducers';

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
  matchJoinEquipeReducer,
  matchAddScoreReducer,

} from './reducers/matchReducers.js';

import { notificationReducer } from "./reducers/notificationReducer";

import {
  invitationSendReducer,
  invitationListMyReducer,
} from "./reducers/invitationReducers";
import {
   competitionDetailsReducer, 
   competitionListReducer,
   competitionUpdateReducer,
   competitionMineReducer
} from './reducers/competitionReducers';
 

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
      footballeurSearch: footballeurSearchReducer,


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
      matchJoinEquipe: matchJoinEquipeReducer,
      matchAddScore: matchAddScoreReducer,
      evaluationCreate: evaluationCreateReducer,
      notifications: notificationReducer,

      invitationSend: invitationSendReducer,
      myInvitations: invitationListMyReducer,

      equipe: equipeReducer,
      myCaptainEquipes: myCaptainEquipesReducer,
      equipeCreate: equipeCreateReducer,
      equipeMine: equipeMineReducer,
      equipeDetails: equipeDetailsReducer,
      competitionList:competitionListReducer,
      competitionDetails:competitionDetailsReducer,
      competitionUpdate: competitionUpdateReducer, 
      competitionMine: competitionMineReducer,   


    },
    preloadedState,
  });
}



