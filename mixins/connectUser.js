import { userService } from "@/services/users.service"
export default {
  methods: {
    async signin() {
      try {
        const result = await userService.signin(this.username, this.password)
        const token = result.accessToken
        const infos = result.userData

        const user = {
          id: infos.id,
          username: infos.username,
          role: infos.role,
          nickname: infos.nickname,
          spotify: infos.spotify,
          link: infos.link,
          contactByMail: infos.contactByMail,
          countTanda: infos.countTanda,
          favorites: infos.favorites,
          refreshToken: infos.refreshToken,
          token
        }

        this.$store.dispatch("authApp/setUser", user)

        // localStorage.setItem('user', JSON.stringify(user))
        this.$cookies.set("user", JSON.stringify(user))

        // this.$router.replace({ path: '/my-tandas' })
        document.location.href = "/"
      } catch (e) {
        this.fail = true
      }
    }
  }
}
