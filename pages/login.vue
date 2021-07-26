<template>
  <div id="app">
    <div class="wrapper">
      <div>
        <h2 class="text-tertiary">
          تسجيل دخول للدوري الخاص بك
        </h2>

        <div class="form-control">
          <label for="name">اسم الدوري</label>
          <input id="name" v-model="league.name" type="text">
        </div>

        <div class="form-control">
          <label for="password">كلمة المرور</label>
          <input id="password" v-model="league.password" type="password">
        </div>

        <div>
          <nuxt-link to="/new">
            ليس لديك دوري؟ انشئ واحدًا
          </nuxt-link>
        </div>
        <button @click="login">
          تسجيل دخول
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      league: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$http.$post('/leagues/login', this.league)
        .then((res) => {
          localStorage.setItem('league', JSON.stringify(res))
          this.$router.push('/')
        })
        .catch(res => alert(res))
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
.form-control {
  margin-bottom: 10px
}
.form-control label {
  display: block;
  color: white
}
.form-control input {
  padding: 10px;
  border-radius: 10px;
  color: black !important
}
</style>
