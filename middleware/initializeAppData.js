import { tandaService } from '@/services/tandas.service'

export default async function({ store }) {
  // Load User
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'))
    store.dispatch('authApp/setUser', user)
  }

  if (store.getters['tandas/getMyTandas'].length === 0) {
    const user = store.getters['authApp/getUser']
    if (user.id) {
      const myTandas = await tandaService.getTandasUser(user.id)

      myTandas.tandas.forEach((tanda) => {
        store.dispatch('tandas/addTanda', { target: 'myTandas', tanda })
      })
    }
  }

  if (store.getters['tandas/getAllTandas'].length === 0) {
    const allTandas = await tandaService.getTandas()

    allTandas.tandas.forEach((tanda) => {
      store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
    })
  }
}
