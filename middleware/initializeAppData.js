// import { userService } from "@/services/users.service"

export default function({ store, app }) {
  // Load User
  if (app.$cookies.get("user")) {
    const userInCookie = app.$cookies.get("user")
    store.dispatch("authApp/setUser", userInCookie)

    // console.log("in cookie", userInCookie)
    // try {
    //   const user = await userService.getUser(userInCookie)
    //   console.log(">>>>>>>>>>>>>", user)
    //   // refresh the user
    //   app.$cookies.set("user", user)
    //   store.dispatch("authApp/setUser", user)
    // } catch (e) {
    //   console.log("error get user", e)
    // }
  }

  // test if a spotify user has a refresh token. If not he has to sign with spotify
}
