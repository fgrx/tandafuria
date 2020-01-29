import { mount, shallowMount } from '@vue/test-utils'
import TandaItem from '@/components/TandaItem.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'
import { tandaSamples } from '~/data/myTandasExample'

Vue.use(Vuetify)

let wrapper = null
const tanda = tandaSamples[0]

beforeEach(() => {
  wrapper = shallowMount(TandaItem, {
    propsData: {
      tanda
    }
  })
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
