import { mount, shallowMount } from '@vue/test-utils'
import TandaItemBis from '@/components/TandaItemBis.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'
// import { myTandaSamples } from '~/data/myTandasExample'

Vue.use(Vuetify)

let wrapper = null

// const tanda = myTandaSamples[0]

const datasToOverwrite = {
  orchestra: {},
  flash: { message: '', display: false, icon: 'mdi-check-circle-outline' },
  flashMessage: false,
  textFlashMessage: '',
  period: '',
  duration: '',
  showMore: false,
  currentUser: { id: 1, name: 'Fabien' }
}

beforeEach(() => {
  wrapper = mount(TandaItemBis, {
    propsData: {
      tanda
    },
    created() {
      this.orchestra = {}
    }
  })
  //wrapper.setData(datasToOverwrite)
})

describe('Tanda item', () => {
  test('should mount', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  }),
    test('should display', () => {
      expect(wrapper.html()).toContain('Francisco Canaro')
    })
})

afterEach(() => {
  wrapper.destroy()
})
