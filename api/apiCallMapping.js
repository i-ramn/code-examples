import * as loginActions from "../pages/LoginPage/actions";
import * as loginAPI from "../pages/LoginPage/api";

import * as registrationActions from "../pages/RegistrationPage/actions";
import * as registrationAPI from "../pages/RegistrationPage/api";

import * as productsActions from "../pages/ProductsPage/actions";
import * as productsAPI from "../pages/ProductsPage/api";

import * as pokemonDetailsActions from "../pages/PokemonDetailsPage/actions";
import * as pokemonDetailsAPI from "../pages/PokemonDetailsPage/api";

import * as cartStateActions from "../pages/CartPage/actions";
import * as cartStateAPI from "../pages/CartPage/api";

import * as userInfoActions from "../pages/UserPage/actions";
import * as userInfoAPI from "../pages/UserPage/api";

const apiCallsMapping = (action) => {
  const mapping = {
    [loginActions.SIGN_IN_REQUEST]: loginAPI.signIn,
    [registrationActions.SIGN_UP_REQUEST]: registrationAPI.signUp,
    [productsActions.GET_POKEMONS_REQUEST]: productsAPI.getPokemons,
    [pokemonDetailsActions.GET_POKEMON_DETAILS_REQUEST]:
      pokemonDetailsAPI.getPokemonDetails,
    [cartStateActions.ADD_TO_CART_REQUEST]: cartStateAPI.addToCardItem,
    [cartStateActions.CART_STATE_REQUEST]: cartStateAPI.getCartState,
    [cartStateActions.REMOVE_ITEM_REQUEST]: cartStateAPI.removeItem,
    [cartStateActions.CHANGE_QUANTITY_ITEM_REQUEST]:
      cartStateAPI.addQuantityItem,
    [cartStateActions.MAKE_ORDER_REQUEST]: cartStateAPI.makeOrder,
    [userInfoActions.GET_ORDER_REQUEST]: userInfoAPI.getOrders,
  };

  if (!mapping.hasOwnProperty(action.type)) {
    throw new SyntaxError("Not mapped action");
  }

  //console.log("FOUND FUNC TO CALL", mapping[action.type]);

  return mapping[action.type];
};

export default apiCallsMapping;
