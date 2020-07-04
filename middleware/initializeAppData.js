export default function({ store, app }) {
  // Load User
  if (app.$cookies.get("user")) {
    const user = app.$cookies.get("user")
    store.dispatch("authApp/setUser", user)
  }
}
