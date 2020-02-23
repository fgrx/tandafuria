<template>
  <div>
    <v-row align="center" class="mx-0">
      <v-rating
        v-model="rating"
        @input="rateAction()"
        label="rating"
        small
        hover
      ></v-rating>
      <span class="grey--text text--lighten-2 caption mr-2">({{ count }})</span>
    </v-row>

    <v-dialog
      ref="dialog"
      v-model="dialogComment"
      @input="initComment()"
      max-width="800px"
    >
      <v-card>
        <v-card-title><h1>Give your advice</h1></v-card-title>

        <v-card-text>
          <form ef="CommentForm" class="CommentForm">
            <v-rating
              v-model="rating"
              label="rating"
              :hover="this.hover"
            ></v-rating>
            <v-textarea
              v-model="comment"
              label="Comment"
              rows="4"
              placeholder="Write a comment about this tanda"
            ></v-textarea>
          </form>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn @click="saveCommentAction()" color="primary">Save</v-btn>
          <v-btn @click="commentFormClose()">Back</v-btn>
        </v-card-actions>
      </v-card>

      <v-btn ref="commentFormBtn" @click="commentFormClose()" color="primary"
        >Close</v-btn
      >
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    tanda: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      count: 0,
      rating: 0,
      hover: true,
      comment: '',
      dialogComment: false,
      tandaToComment: null,
      user: {}
    }
  },
  mounted() {
    if (this.tanda.comments) this.count = this.tanda.comments.length
    this.rating = this.tanda.overallRating || 0

    this.user = this.$store.getters['authApp/getUser']
  },
  methods: {
    rateAction(rate) {
      this.dialogComment = true
    },
    commentFormClose() {
      this.comment = ''
      this.dialogComment = false
    },
    saveCommentAction() {
      this.saveRating()
      this.commentFormClose()
    },
    saveRating() {
      const tandaUpdated = JSON.parse(JSON.stringify(this.tanda))

      const sumOfAllRatingReducer = (acc, currentValue) =>
        acc + currentValue.rating

      let sumOfAllRating = 0

      if (this.tanda.comments) {
        sumOfAllRating =
          this.tanda.comments.reduce(sumOfAllRatingReducer, 0) +
          parseInt(this.rating, 10)
      }

      let numberOfComments = 0

      if (this.tanda.comments) {
        numberOfComments = this.tanda.comments.length + 1
      }

      tandaUpdated.overallRating = sumOfAllRating / numberOfComments

      const commentInfos = {
        rating: this.rating,
        comment: this.comment,
        author: {
          id: this.user.id,
          name: this.user.nickname
        }
      }

      if (tandaUpdated.comments) {
        tandaUpdated.comments.push(commentInfos)
      } else {
        tandaUpdated.comments = [commentInfos]
      }

      console.log('update', tandaUpdated)
    }
  }
}
</script>

<style lang="scss" scoped></style>
