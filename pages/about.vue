<template>
  <v-layout>
    <v-flex>
      <v-card raised class="mx-auto mb-4" max-width="800">
        <v-card-title>
          <h1>About Tanda Furia</h1>
        </v-card-title>
        <v-card-text class="body-1">
          <p>
            TandaFuria is made by Fabien Grignoux. I'm a tango dancer / Dj /
            geek from France in Lyon.<br />
            If you like this application or if you have any suggestions or ideas
            to improve this app, please contact me on Facebook or LinkedIn :
          </p>
          <v-btn
            text
            outlined
            color="primary"
            to="https://www.facebook.com/fabien.grignoux"
            ><v-icon>mdi-facebook</v-icon> Facebook</v-btn
          >
          <v-btn
            text
            outlined
            color="primary"
            to="https://www.linkedin.com/in/fabien-grignoux/"
            ><v-icon>mdi-linkedin</v-icon> Linkedin</v-btn
          >
        </v-card-text>
      </v-card>

      <v-spacer></v-spacer>

      <v-card raised class="mx-auto mt-4 mb-4" max-width="800">
        <v-card-title>
          <h2>Frequently Asked Questions</h2>
        </v-card-title>
        <v-card-text class="body-1">
          <h3>
            Why do i need a Spotify premium account to listen to full tracks ?
          </h3>
          <p>
            TandaFuria use a Spotify player to send sound to your speaker. Due
            to Spotify's policy, only premium users can use this functionnality.
          </p>
          <v-divider class="mb-4"></v-divider>
          <h3>
            Where do all track data come from ?
          </h3>
          <p>
            Every tracks informations come from Spotify's databases.
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            Can i save Spotify tracks on my computer ?
          </h3>
          <p>
            No, Spotify don't allow users to save music on their computer.
            However it would be great help for Tando DJ's ...
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            Playing songs is not very stable on my computer, can you fix this ?
          </h3>
          <p>
            The Spotify player send multiple requests to their servers while you
            are playing a song. If you use an add blocker it may block these
            requests and as a result Spotify will stop the listening.
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
