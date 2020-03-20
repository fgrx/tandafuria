<template>
  <v-card raised class="mx-auto mt-4 mb-4" max-width="850">
    <form action="https://formspree.io/myypdbpb" method="POST">
      <v-card-title><h1>Contact</h1></v-card-title>

      <v-card-text class="body-1">
        <p>
          Do you have some suggestions ? Don't hesitate to use the form below to
          contact me.
        </p>
        <p>Thanks for using TandaFury - Fabien</p>
        <p>
          <label>
            Your email:<br />
            <input type="text" name="_replyto" class="field" />
          </label>
        </p>
        <p>
          <label>
            Your message:<br />
            <textarea name="message" class="field textfield"></textarea>
          </label>
        </p>
      </v-card-text>

      <v-card-actions>
        <v-btn type="submit" color="primary">Send</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.field {
  border: 1px solid rgb(199, 197, 197);
  width: 100%;
}

.textfield {
  height: 10em;
}
</style>
