export default function({ store, redirect }) {
  if (store.getters['authApp/getUser'].length == null) redirect('/signin')
}
