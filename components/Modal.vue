<template>
  <div class="modal-backdrop">
    <div v-if="matchId" class="modal">
      <header class="modal-header">
        <slot name="header">
          تعديل المباراة
        </slot>
        <button type="button" class="btn-close" @click="close">
          x
        </button>
      </header>

      <section class="modal-body">
        <slot name="body">
          <section class="current-game">
            <h2 class="text-tertiary">
              المبارة المختارة
            </h2>
            <h4>
              {{ game[0].name }}
              {{ game[0].goals }} - {{ game[1].goals }}
              {{ game[1].name }}
            </h4>

            <div class="goal">
              <select id="goalFor" v-model="player" name="goal">
                <option value="2" disabled>
                  اختر اللاعب
                </option>
                <option :value="0">
                  {{ game[0].name }}
                </option>
                <option :value="1">
                  {{ game[1].name }}
                </option>
              </select>

              <button :disabled="player === 2" @click="addGoal(1)">
                هدف
              </button>

              <button
                :disabled="player === 2 || game[player].goals === 0"
                @click="addGoal(-1)"
              >
                إلغاء هدف
              </button>
            </div>

            <button :disabled="endingGame" class="expanded" @click="editGame">
              تعديل المباراة
            </button>
          </section>
        </slot>
      </section>

      <footer class="modal-footer">
        <slot name="footer" />
        <button :disabled="endingGame" type="button" class="btn-green" @click="close">
          إلغاء
        </button>
        <button :disabled="endingGame" type="button" class="danger-button margin-top" @click="deleteGame">
          حذف المبارة
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    matchId: {
      type: String,
      default: () => ''
    },
    currentGame: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      game: [],
      player: 2,
      endingGame: false
    }
  },
  watch: {
    currentGame: {
      immediate: true,
      deep: true,
      handler (val) {
        if (val) {
          this.game = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    addGoal (number) {
      this.game[this.player].goals += number
    },
    async editGame () {
      this.endingGame = true
      await this.$http.put('/matches', { game: this.game, matchId: this.matchId })
        .then((res) => {
          this.endingGame = false
          this.close()
        })
        .catch(res => alert(res))
    },
    async deleteGame () {
      this.endingGame = true
      await this.$http.post('/matches/delete', { game: this.game, matchId: this.matchId })
        .then((res) => {
          this.endingGame = false
          this.close()
        })
        .catch(res => alert(res))
    }
  }
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #16161a;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  width: 80%;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #7f5af0;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #7f5af0;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #2cb67d;
  background: transparent;
}

.btn-green {
  color: white;
  background: #2cb67d;
  border: 1px solid #2cb67d;
  border-radius: 2px;
}
</style>
