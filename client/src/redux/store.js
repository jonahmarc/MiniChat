import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import rootReducer from './root-reducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key:'primary',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [logger];

// const store = createStore(rootReducer, applyMiddleware(...middlewares));
const store = createStore(persistedReducer, applyMiddleware(...middlewares));

const Persistor = persistStore(store) ;

export {Persistor};
export default store;
