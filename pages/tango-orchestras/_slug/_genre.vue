<template>
  <div>
    <h1>{{ genre }} by {{ slug }}</h1>
    {{ this.$route.params }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      genre: this.$route.params.genre,
      slug: this.$route.params.slug,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
