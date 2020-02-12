export default function({ store, redirect }) {
  const user = store.getters['authApp/getUser']
  if (user.id === null) redirect('/signin')
}
