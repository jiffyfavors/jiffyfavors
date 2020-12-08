export default function({ store, redirect }) {
    if (!store.getters['auth/isAuth']) {
      return redirect('/login')
    }else{
    	store.dispatch('auth/getProfile')
    }
  
}
