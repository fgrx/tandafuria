import { myTandaSamples } from '@/data/myTandasExample'
import { allTandaSamples } from '@/data/allTandasExample'

export default function({ store }) {
  if (store.getters['tandas/getMyTandas'].length === 0) {
    myTandaSamples.forEach((tanda) => {
      store.dispatch('tandas/addTanda', { target: 'myTandas', tanda })
    })
  }

  if (store.getters['tandas/getAllTandas'].length === 0) {
    allTandaSamples.forEach((tanda) => {
      store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
    })
  }
}
