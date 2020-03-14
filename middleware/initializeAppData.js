export default function({ store }) {
  // Load User
  if (process.browser) {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      store.dispatch('authApp/setUser', user)
    }
  }
}
