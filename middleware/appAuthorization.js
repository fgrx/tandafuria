export default function({ store, route, redirect }) {
  if (store.getters['authApp/getUser'].length === 0) {
    const user = { id: 1, name: 'Fabien' }
    store.dispatch('authApp/setUser', user)
  }
}
