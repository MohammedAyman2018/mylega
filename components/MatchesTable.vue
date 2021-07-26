<template>
  <div>
    <!-- جدول الماتشات -->
    <section>
      <h2 class="text-tertiary">
        جدول المباريات
        <sub>({{ matches.length }})</sub>
      </h2>

      <table v-if="onLine">
        <thead>
          <tr>
            <th colspan="4">
              التفاصيل
            </th>
            <th>بتاريخ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="l in displayedMatches"
            :key="l._id"
            @click="isModalVisible = true; gameToEdit=[l.player1, l.player2]; gameToEdiId=l._id;"
          >
            <td>{{ l.player1.name }}</td>
            <td>{{ l.player1.goals }}</td>
            <td>{{ l.player2.goals }}</td>
            <td>{{ l.player2.name }}</td>
            <td>{{ l.createdAt.substr(0, 10) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>
        لا يوجد اتصال بالانترنت
      </p>
    </section>

    <button
      v-for="i in pages"
      :key="i"
      style="padding: 10px; margin: 5px"
      @click="currentPage = i - 1"
    >
      {{ i }}
    </button>

    <modal v-show="isModalVisible" :current-game="gameToEdit" :match-id="gameToEdiId" @close="isModalVisible = false; $emit('getThem')" />
  </div>
</template>

<script>
import Modal from './Modal.vue'
export default {
  components: { Modal },
  props: {
    pages: {
      type: Number,
      default: () => 0
    },
    matches: {
      type: Array,
      default: () => []
    },
    onLine: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      currentPage: 0,
      isModalVisible: false,
      gameToEdit: null,
      gameToEdiId: null,
      perPage: 10
    }
  },
  computed: {
    displayedMatches () {
      const idx = this.currentPage * this.perPage
      return this.matches.slice(idx, idx + this.perPage)
    }
  }
}
</script>

<style>
</style>
