import { tandaService } from '@/services/tandas.service'

export default async function({ store }) {
  if (store.getters['tandas/getMyTandas'].length === 0) {
    const myTandas = await tandaService.getTandasUser('1')
    myTandas.data.forEach((tanda) => {
      store.dispatch('tandas/addTanda', { target: 'myTandas', tanda })
    })
  }

  if (store.getters['tandas/getAllTandas'].length === 0) {
    const allTandas = await tandaService.getTandas()
    allTandas.data.forEach((tanda) => {
      store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
    })
  }
}
