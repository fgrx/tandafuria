<template>
  <div class="text-center">
    <v-card raised align="center" class="mx-auto">
      <div id="topSite">
        <div class="centerVertically">
          <div>
            <h1 class="title1 display-4">Tanda Furia !</h1>
          </div>

          <div>
            <h2 class="title2 display-2">The tanda temple for tango djs</h2>
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

    <v-row>
      <v-col v-for="(maestro, key) in maestros1" :key="key" cols="12" md="3">
        <v-card shaped raised class="mx-auto" max-width="400">
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

      <v-col v-for="maestro in maestros2" cols="12" md="3">
        <v-card shaped raised class="mx-auto" max-width="400">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      maestros1: [
        {
          name: "Juan D'arienzo",
          url: '',
          image: require('@/static/arienzov.jpg')
        },
        {
          name: 'Osvaldo Pugliese',
          url: '',
          image: require('@/static/pugliesev.png')
        },
        {
          name: 'Carlos Di Sarli',
          url: '',
          image: require('@/static/sarliv.png')
        },
        {
          name: 'Francisco Canaro',
          url: '',
          image: require('@/static/canarov.png')
        }
      ],
      maestros2: [
        {
          name: 'Alfredo De Angelis',
          url: '',
          image: require('@/static/angelisv.jpg')
        },
        {
          name: 'Anibal Troilo',
          url: '',
          image: require('@/static/troilov.png')
        },

        {
          name: 'Edgardo Donato',
          url: '',
          image: require('@/static/donatov.jpg')
        },
        {
          name: 'Miguel Calo',
          url: '',
          image: require('@/static/calov.jpg')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#topSite {
  .title1 {
    color: white;
    display: block;
  }

  .title2 {
    color: white;
  }
}

.maestroName {
  color: white;
}

#topSite {
  z-index: 20;
  position: relative;
  height: 60vh;
  width: 100%;
}

.centerVertically {
  z-index: 30;
  position: absolute;
  align-items: center;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#imageHome {
  height: 60vh;
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
    rgba(49, 27, 146, 0.91) 0%,
    rgba(206, 39, 161, 0.91) 100%
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
</style>
