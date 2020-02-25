<template>
  <div class="text-center">
    <v-card raised align="center">
      <div id="topSite">
        <div class="centerVertically">
          <div>
            <h1 class="title1 display-4">
              <span class="invisible">Tanda Furia</span>
              <v-img
                :src="require('~/static/logo-white.png')"
                alt="Tanda Furia"
                max-width="680px"
                class="logoTandaFuria"
              />
            </h1>
          </div>

          <div>
            <h2 class="title2 display-1 ma-5">
              The tanda temple for tango djs
            </h2>
          </div>
        </div>

        <v-img
          id="imageHome"
          :src="require('@/static/background.jpg')"
          class="white--text align-end"
        ></v-img>
      </div>

      <!-- <v-img
          :src="require('@/static/icon.png')"
          max-height="50px"
          alt="tanda furia logo"
        /> -->
    </v-card>

    <v-container v-if="!signed">
      <h2 class="display-3 mt-12 mb-3">Register to get full access</h2>

      <v-row class="title" align="center">
        <v-col cols="11" offset-md="1" md="3">
          <p>
            <v-btn to="signin" color="secondary" rounded x-large block
              ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
            >
          </p>

          <p>
            <v-btn to="create-account" rounded x-large color="primary" block
              ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
            >
          </p>
        </v-col>
        <v-col cols="12" md="7" offset-md="1" class="text-left">
          <ul>
            <li>Discover new tandas</li>

            <li>
              Create your own tandas and share them (or not) with the community
            </li>

            <li>Create your own playlists</li>

            <li>
              Access to full length track if you have a
              <v-icon>mdi-spotify</v-icon> Spotify <u>premium</u> account
            </li>
            <li>
              Comment others work and help other Djs to improve their tandas
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
    <h2 class="display-3 mt-12 mb-3">Start digging in tandas !</h2>

    <v-row>
      <v-col v-for="maestro in maestros1" :key="maestro.url" cols="6" md="3">
        <v-card
          :to="`/all-tandas?orchestra=${maestro.url}`"
          shaped
          raised
          class="mx-auto"
          max-width="400"
        >
          <div class="centerVertically">
            <h3 class="maestroName title">{{ maestro.name }}</h3>
          </div>
          <v-img
            :src="maestro.image"
            class="white--text align-end itemMaestro1"
            height="200px"
          >
          </v-img>
        </v-card>
      </v-col>

      <v-col v-for="maestro in maestros2" :key="maestro.url" cols="6" md="3">
        <v-card
          :to="`/all-tandas?orchestra=${maestro.url}`"
          shaped
          raised
          class="mx-auto"
          max-width="400"
        >
          <div class="centerVertically">
            <h3 class="maestroName title">{{ maestro.name }}</h3>
          </div>
          <v-img
            :src="maestro.image"
            class="white--text align-end itemMaestro2"
            height="200px"
          >
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <v-container v-if="topUsers.length > 0">
      <h2 class="display-3 mt-12 mb-3">Tanks to our contributors</h2>
      <ul>
        <li v-for="(user, userId) in topUsers" :key="userId" class="noTick">
          <v-btn
            v-if="user.countTanda > 0"
            :to="{ name: 'djs-id', params: { id: user.id } }"
            text
          >
            <v-badge
              :content="user.countTanda"
              color="primary"
              left
              transition="slide-x-transition"
              inline
            >
              {{ user.nickname }}
            </v-badge>
          </v-btn>
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
import { userService } from '@/services/users.service'
export default {
  data() {
    return {
      signed: false,
      topUsers: {},
      maestros1: [
        {
          name: "Juan D'arienzo",
          url: 'jdarienzo',
          image: require('@/static/arienzov.jpg')
        },
        {
          name: 'Osvaldo Pugliese',
          url: 'opugliese',
          image: require('@/static/pugliesev.png')
        },
        {
          name: 'Carlos Di Sarli',
          url: 'cdisarli',
          image: require('@/static/sarliv.png')
        },
        {
          name: 'Francisco Canaro',
          url: 'fcanaro',
          image: require('@/static/canarov.png')
        }
      ],
      maestros2: [
        {
          name: 'Alfredo De Angelis',
          url: 'adeangelis',
          image: require('@/static/angelisv.jpg')
        },
        {
          name: 'Anibal Troilo',
          url: 'atroilo',
          image: require('@/static/troilov.png')
        },

        {
          name: 'Edgardo Donato',
          url: 'edonato',
          image: require('@/static/donatov.jpg')
        },
        {
          name: 'Miguel Calo',
          url: 'mcalo',
          image: require('@/static/calov.jpg')
        }
      ]
    }
  },
  async mounted() {
    const user = this.$store.getters['authApp/getUser']
    if (user.id) this.signed = true

    this.topUsers = await userService.getTopUsers()
  }
}
</script>

<style lang="scss" scoped>
.invisible {
  display: none;
}

h1 {
  img {
    width: '200px' !important;
  }
}

.logoTandaFuria {
  width: '200px' !important;
}

#topSite {
  .title1 {
    color: white;
    display: block;
    font-family: 'Overpass' !important;
  }

  .title2 {
    color: white;
    font-family: 'Overpass' !important;
  }
}

.maestroName {
  color: white;
  font-family: 'Overpass' !important;
}

#topSite {
  z-index: 0;
  position: relative;
  height: 65vh;
  width: 100%;
}

.centerVertically {
  z-index: 1;
  position: absolute;
  align-items: center;
  width: 100%;
  padding: 30px;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#imageHome {
  height: 65vh;
}

#imageHome::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(
    top,
    rgba(49, 27, 146, 0.83) 0%,
    rgba(206, 39, 161, 0.83) 100%
  );
}

.itemMaestro2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // height: 100%;
  background: -webkit-linear-gradient(
    top,
    rgba(18, 204, 148, 0.81) 0%,
    rgba(49, 27, 146, 0.81) 100%
  );
  // background: -webkit-linear-gradient(
  //   top,
  //   rgba(206, 39, 161, 0.75) 0%,
  //   rgba(142, 229, 255, 0.75) 100%
  // );
  // background: -webkit-linear-gradient(
  //   top,
  //   rgba(223, 68, 181, 0.75) 0%,
  //   rgba(49, 27, 146, 0.86) 100%
  // );
}

.itemMaestro1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(
    top,
    rgba(49, 27, 146, 0.81) 0%,
    rgba(18, 204, 148, 0.81) 100%
  );
}

li.noTick {
  list-style-type: none;
}
</style>
