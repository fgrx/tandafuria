export default async function ({ store, app }) {
  // Load User
  if (app.$cookies.get("user")) {
    const userInCookie = app.$cookies.get("user")
    console.log(userInCookie)

    store.dispatch("authApp/setUser", userInCookie)
  }
}
