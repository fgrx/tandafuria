<template>
  <v-layout>
    <v-flex>
      <v-card raised class="mx-auto mb-4" max-width="850">
        <v-card-title>
          <h1>About Tanda fury</h1>
        </v-card-title>
        <v-card-text class="body-1">
          <p>
            Tandafury is made by Fabien Grignoux. I'm a tango dancer / Dj / Web
            developer from Lyon in France.<br />
            If you like this application or if you have any suggestions or ideas
            to improve this app, please contact me by mail, Facebook or LinkedIn
            :
          </p>
          <v-btn text outlined color="primary" href="/contact"
            ><v-icon>mdi-email</v-icon> Email</v-btn
          >
          <v-btn
            text
            outlined
            color="primary"
            href="https://www.facebook.com/fabien.grignoux"
            ><v-icon>mdi-facebook</v-icon> Facebook</v-btn
          >
          <v-btn
            text
            outlined
            color="primary"
            href="https://www.linkedin.com/in/fabien-grignoux/"
            ><v-icon>mdi-linkedin</v-icon> Linkedin</v-btn
          >
        </v-card-text>
      </v-card>

      <v-spacer></v-spacer>

      <v-card raised class="mx-auto mt-4 mb-4" max-width="850">
        <v-card-title>
          <h2>Frequently Asked Questions</h2>
        </v-card-title>
        <v-card-text class="body-1">
          <h3>
            Why do i need a Spotify premium account to listen to full tracks ?
          </h3>
          <p>
            Tandafury use a Spotify player to send sound to your speaker. Due to
            Spotify's policies, only premium users can use this functionnality.
          </p>
          <v-divider class="mb-4"></v-divider>
          <h3>
            Where do the track data come from?
          </h3>
          <p>
            The track information come from Spotify databases.
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            Can I save Spotify tracks on my computer?
          </h3>
          <p>
            No, Spotify does not allow users to save music on their computer.
            However you can still edit your playlists on Tanda fury, and save
            and sync them with the official spotify app (mobile or desktop).
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            The Spotify mode doesn't work on my smartphone or my Apple computer.
            Why?
          </h3>
          <p>
            No, it doesn't work for now. Safari and mobile devices cannot use
            the Spotify mode due to Spotify's limitations and their DRM. They
            say they are working on it. I hope it will be available soon too. To
            check device compatibility list, follow the link:
            <a
              href="https://developer.spotify.com/documentation/web-playback-sdk/"
              >https://developer.spotify.com/documentation/web-playback-sdk/</a
            >
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            Playing songs is not very stable on my computer, can you fix this ?
          </h3>
          <p>
            If you use an add blocker, it may block these requests and as a
            result Spotify will stop the playing.
          </p>

          <v-divider class="mb-4"></v-divider>
          <h3>
            Is there a connexion between TangoFury.com and TandaFury.com ?
          </h3>
          <p>
            Yes ! I'm the creator of this two websites. If you want to watch
            great tango videos give a try to Tangofury :
            <v-btn
              href="https://tangofury.com"
              target="_blank"
              color="primary"
              outlined
              >TangoFury.com</v-btn
            >
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  head() {
    return {
      title: 'About Tanda fury',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Tanda fury is created by Fabien Grignoux, a french web developper in Lyon (France). In this page you will find technical details about this tool and other frequently asked questions.'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `About Tanda fury`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            'Tanda fury is created by Fabien Grignoux, a french web developper in Lyon (France). In this page you will find technical details about this tool and other frequently asked questions.'
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: require('@/static/tandafurybanner.jpg')
        },
        {
          hid: 'og:image:width',
          name: 'og:image:width',
          content: `1280`
        },
        {
          hid: 'og:image:height',
          name: 'og:image:height',
          content: `486`
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
