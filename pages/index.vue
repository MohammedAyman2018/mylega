<template>
  <div id="app">
    <h1>FIFA 21</h1>
    <button @click="logout">
      خروج من الدوري
    </button>
    <section v-if="currentGame.length === 0" class="current-game">
      <h2 class="text-tertiary">
        مباراة جديدة
      </h2>

      <div class="goal">
        <select id="player1" v-model="player1" name="player1">
          <option v-for="(theplayer, idx) in players" :key="theplayer._id" :value="idx">
            {{ theplayer.name }}
          </option>
        </select>

        <select id="player2" v-model="player2" name="player2">
          <option v-for="(theplayer2, idx) in players" :key="theplayer2._id" :value="idx">
            {{ theplayer2.name }}
          </option>
        </select>

        <button :disabled="player1 === player2" @click="createGame">
          بدء
        </button>
      </div>
    </section>

    <section v-else class="current-game">
      <h2 class="text-tertiary">
        المبارة الحالية
      </h2>
      <h4>
        {{ currentGame[0].name }}
        {{ currentGame[0].goals }} - {{ currentGame[1].goals }}
        {{ currentGame[1].name }}
      </h4>

      <div class="goal">
        <select id="goalFor" v-model="player" name="goal">
          <option value="2" disabled>
            اختر اللاعب
          </option>
          <option :value="0">
            {{ currentGame[0].name }}
          </option>
          <option :value="1">
            {{ currentGame[1].name }}
          </option>
        </select>

        <button :disabled="player === 2" @click="addGoal(1)">
          هدف
        </button>

        <button :disabled="player === 2 || currentGame[player].goals === 0" @click="addGoal(-1)">
          إلغاء هدف
        </button>
      </div>

      <button class="expanded" @click="endGame">
        انهاء المباراة
      </button>

      <button class="expanded margin-top danger-button" @click="deleteGame">
        حذف المباراة بدون حفظ
      </button>
    </section>

    <champion-tabls :players="players" :on-line="onLine" />

    <h2 class="text-tertiary">
      المواجهات المباشرة
    </h2>
    <div class="cards">
      <div v-for="(player21, key) in facetoface" :key="key" class="card">
        <p class="text-tertiary">
          {{ key }}
        </p>
        <table>
          <tr>
            <td v-for="(name, key32) in player21" :key="key32">
              {{ key32 }}
            </td>
          </tr>
          <tr>
            <td v-for="(name, key32) in player21" :key="key32">
              <p>كسبه: {{ name.lose }}</p>
              <p>خسر منه: {{ name.win }}</p>
              <p>تعادل: {{ name.draw }}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <head-to-head :players="players" :on-line="onLine" />
    <matches-table :matches="matches" :on-line="onLine" :pages="pages" @getThem="getData" />

    <add-player @playerAdded="updateLocalStorage" />
  </div>
</template>

<script>
import ChampionTabls from '@/components/ChampionTabls.vue'
import MatchesTable from '@/components/MatchesTable.vue'
// import HeadToHead from '@/components/HeadToHead.vue'
import AddPlayer from '@/components/AddPlayer.vue'
export default {
  name: 'App',
  components: { ChampionTabls, MatchesTable, AddPlayer },
  data () {
    return {
      player1: 0, // For Starting A new Game
      player2: 0, // For Starting A new Game

      player: 2, // For Goals
      players: [], // For table
      matches: [], // For table
      currentGame: [], // For Game
      facetoface: null,
      pages: 0,
      perPage: 10
    }
  },
  computed: {
    onLine () {
      return this.$nuxt.isOnline
    }
  },
  async beforeMount () {
    if (!localStorage.getItem('league')) {
      this.$router.push('/login')
    } else {
      await this.updateLocalStorage()
    }
  },
  mounted () {
    const gameInStorage = localStorage.getItem('currentGame')
    if (gameInStorage) {
      this.currentGame = JSON.parse(gameInStorage)
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('league')
      this.$router.push('/login')
    },
    async updateLocalStorage () {
      const updateLocalStorage = await this.$http.$get(`/leagues/update/${JSON.parse(localStorage.getItem('league'))._id}`)
      localStorage.setItem('league', JSON.stringify(updateLocalStorage))
      const league = JSON.parse(localStorage.getItem('league'))
      this.getData(league)
    },
    getData (league) {
      const newLeague = JSON.parse(JSON.stringify(league))
      this.getPlayers(newLeague.players)
      this.getMatches(newLeague.matches)
      this.facetoface = this.testing()
    },
    testing () {
      const obj = {}
      this.players.forEach((player, index) => {
        obj[player.name] = {}
        const playersClone = [...this.players].map(y => y.name)
        playersClone.splice(playersClone.findIndex(x => x === player.name), 1)
        playersClone.forEach((restPlayer) => {
          obj[player.name][restPlayer] = { win: 0, lose: 0, draw: 0 }
        })
      })

      this.matches.forEach((match) => {
        const player1 = match.player1.name
        const player2 = match.player2.name

        if (match.player1.goals > match.player2.goals) {
          obj[player1][player2].win++
          obj[player2][player1].lose++
        } else if (match.player1.goals < match.player2.goals) {
          obj[player1][player2].lose++
          obj[player2][player1].win++
        } else {
          obj[player1][player2].draw++
          obj[player2][player1].draw++
        }
      })

      return obj
    },
    getPlayers (players) {
      players.forEach((player) => {
        player.points = (player.win * 3) + player.draw
        player.vs = {}
        players.forEach((x) => {
          if (x.name !== player.name) { player.vs[x.name] = 0 }
        })
      })
      this.players = players.sort((x, y) => y.points - x.points)
    },
    getMatches (matches) {
      this.matches = matches
      this.pages = Math.ceil(matches.length / this.perPage)
      this.matches.forEach((match) => {
        const player1 = match.player1.name
        const player2 = match.player2.name

        const player1Record = this.players.find(player => player.name === player1)
        const player2Record = this.players.find(player => player.name === player2)

        player1Record.vs[player2]++
        player2Record.vs[player1]++
      })
    },
    createGame () {
      this.currentGame = [
        { id: this.players[this.player1]._id, name: this.players[this.player1].name, goals: 0 },
        { id: this.players[this.player2]._id, name: this.players[this.player2].name, goals: 0 }
      ]
      localStorage.setItem('currentGame', JSON.stringify(this.currentGame))
      this.player1 = 0
      this.player2 = 0
    },
    deleteGame () {
      this.currentGame = []
      localStorage.removeItem('currentGame')
    },
    addGoal (number) {
      this.currentGame[this.player].goals += number
      localStorage.setItem('currentGame', JSON.stringify(this.currentGame))
    },
    async endGame () {
      await this.$http.post('/matches', { game: this.currentGame, leagueId: JSON.parse(localStorage.getItem('league'))._id })
        .then(async (res) => {
          localStorage.removeItem('currentGame')
          await this.updateLocalStorage()
          this.currentGame = []
        })
        .catch(res => alert(res.response.data.msg))
    }
  }
}
</script>

<style>
.cards {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  align-content: space-around;
}

.card table td{
  padding: 10px
}
</style>
