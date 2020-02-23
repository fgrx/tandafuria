<template>
  <div>
    <v-row align="center" class="mx-0">
      <v-rating
        v-model="rating"
        @input="rateAction()"
        :hover="hover"
        :readonly="readonly"
        label="rating"
        small
      ></v-rating>
      <v-btn
        v-if="count"
        @click="seeCommentsAction()"
        color="secondary"
        small
        text
        ><v-icon small>mdi-comment-text-multiple</v-icon> {{ count }}</v-btn
      >
    </v-row>

    <v-dialog ref="dialog" v-model="dialogComment" max-width="800px">
      <v-card>
        <div v-if="rateMode">
          <v-card-title>Give your advice</v-card-title>

          <v-card-text>
            <form ef="CommentForm" class="CommentForm">
              <v-rating
                v-model="rating"
                :hover="hover"
                label="rating"
              ></v-rating>
              <v-textarea
                v-model="comment"
                label="Comment"
                rows="4"
                placeholder="Write a comment about this tanda"
              ></v-textarea>
            </form>
          </v-card-text>
        </div>
        <v-spacer></v-spacer>

        <v-card-text v-if="tanda.comments">
          <v-card-title class="display-1">Comments</v-card-title>
          <v-spacer></v-spacer>
          <div
            v-for="(commentElement, keyComment) in tanda.comments"
            :key="keyComment"
            class="comment"
          >
            <h3>
              {{ commentElement.author.name }}
              - {{ $moment(commentElement.date).calendar() }}
            </h3>
            <p><v-rating :value="commentElement.rating" /></p>
            <p>{{ commentElement.comment }}</p>
          </div>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn v-if="rateMode" @click="saveCommentAction()" color="primary"
            >Save</v-btn
          >
          <v-btn @click="commentFormClose()">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { tandaService } from '@/services/tandas.service'

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
      user: {},
      readonly: false,
      rateMode: false,
      comments: []
    }
  },
  mounted() {
    if (this.tanda.comments) this.count = this.tanda.comments.length
    this.rating = this.tanda.overallRating || 0

    this.user = this.$store.getters['authApp/getUser']
    const alreadyCommented = this.isAlreadyCommented()

    if (
      this.user.id === this.tanda.author.id ||
      alreadyCommented === true ||
      this.user.id == null
    ) {
      this.readonly = true
      this.hover = false
    }
  },
  methods: {
    seeCommentsAction() {
      this.rateMode = false
      this.dialogComment = true
    },
    isAlreadyCommented() {
      let result = false

      if (this.tanda.comments) {
        const commentsAuthorId = this.tanda.comments.map(
          (comment) => comment.author.id
        )
        if (commentsAuthorId.includes(this.user.id)) result = true
      }

      return result
    },
    rateAction(rate) {
      this.rateMode = true
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
      } else {
        sumOfAllRating += parseInt(this.rating, 10)
      }

      let numberOfComments = 1

      if (this.tanda.comments) {
        numberOfComments = this.tanda.comments.length + 1
      }

      tandaUpdated.overallRating = sumOfAllRating / numberOfComments

      const aujd = new Date()
      const ms = aujd.getMilliseconds()

      const calculatedId = this.tanda._id + ms

      const commentInfos = {
        id: calculatedId,
        rating: this.rating,
        comment: this.comment,
        date: new Date(),
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

      tandaService.updateTandaComments(
        this.tanda._id,
        tandaUpdated,
        this.user.token
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  margin-bottom: 2rem;
  border-bottom: 1px dotted grey;
}
</style>
