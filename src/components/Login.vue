<template>
  <div class="container-sm">
    <div class="back1"></div>
    <div class="back2"></div>
    <div class="back3"></div>
    <div class="logincard" @keyup.enter="login()">
      <h2 class="title">
        <i class="fa fa-database"></i>
        DB Docs
      </h2>
      <hr />
      <div class="form-group" style="display: inline-block;!important">
        <input
          type="text"
          v-model="username"
          class="rounded-input"
          :class="{'danger-input': !this.username && this.triedLogin}"
          placeholder="Username"
        />
        <i v-if="!this.username && this.triedLogin" class="fa fa-exclamation-circle erroricon"></i>
      </div>
      <div class="form-group">
        <input
          v-model="pass"
          type="password"
          class="rounded-input"
          :class="{'danger-input': !this.pass && this.triedLogin}"
          placeholder="Password"
        />
        <i v-if="!this.pass && this.triedLogin" class="fa fa-exclamation-circle erroricon"></i>
      </div>
      <button class="loginbtn" @click="login">Let's Go!</button>
      <div v-if="wrong" class="wrong">
        <center>
          <i class="fas fa-exclamation-circle"></i> Oops... wrong username or password
        </center>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../api.js";
export default {
  name: "Home",
  data() {
    return {
      username: "",
      pass: "",
      wrong: false,
      triedLogin: false
    };
  },
  watch: {
    // whenever question changes, this function will run
    username: function(newUser, oldUser) {
      this.wrong = false;
    },
    pass: function(newPass, oldPass) {
      this.wrong = false;
    }
  },
  methods: {
    login() {
      this.triedLogin = true;
      if (this.username && this.pass) {
        api
          .login({ name: this.username, pass: this.pass })
          .then(result => {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", this.username);
            this.$router.push({ name: "tablefeed" });
          })
          .catch(() => {
            this.wrong = true;
          });
      }
    }
  }
};
</script>

<style scoped>
.back1 {
  width: 100%;
  height: 20%;
  -webkit-clip-path: polygon(100% 0%, 100% 100%, 0% 0%);
  position: fixed;
  background: rgb(241, 241, 241);
  left: 0;
  top: 0;
}

.back2 {
  width: 100%;
  height: 30%;
  -webkit-clip-path: polygon(0% 100%, 100% 100%, 0% 0%);
  position: fixed;
  background: rgb(240, 240, 240);
  left: 0;
  bottom: 0;
}

.back3 {
  width: 100%;
  height: 10%;
  -webkit-clip-path: polygon(0% 100%, 100% 100%, 0% 0%);
  position: fixed;
  background: linear-gradient(
    to right,
    var(--secondary-main),
    var(--main-color)
  );
  left: 0;
  bottom: 0;
}

.logincard {
  margin-left: auto;
  position: relative;
  margin-right: auto;
  margin-top: 3%;
  width: 480px;
  height: 360px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  padding: 3%;
  text-align: center;
}

.fa-database {
  display: inline-table;
  font-size: 28px;
  color: var(--secondary-main);
  /* display: block; */
  background: -webkit-linear-gradient(var(--secondary-main), var(--main-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  color: var(--dark-grey);
  font-family: cairoB;
  text-align: center;
}
.rounded-input {
  border-radius: 25px;
  border: none;
  background-color: rgb(235, 235, 235);
  padding: 20px;
  width: 300px;
  height: 15px;
}

.danger-input {
  border: 1.2px solid var(--danger) !important;
}

.erroricon {
  position: absolute;
  right: 6.3em;
  margin-top: 12px;
  color: var(--danger);
  pointer-events: none;
}
.form-group {
  margin-bottom: 8%;
}
.loginbtn {
  position: relative;
  display: inline-block;
  padding: 0.8em 3em;
  border: none;
  background: var(--dark-grey);
  border-radius: 30px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  font-size: 13px;
  color: white;
  margin-bottom: 3%;
}

.loginbtn:hover,
.loginbtn:active,
.loginbtn:focus {
  background: linear-gradient(
    to right,
    var(--secondary-main),
    var(--main-color)
  );
}

input:focus {
  box-shadow: none !important;
  border: none;
  outline: none !important;
}

.wrong {
  background-color: var(--danger);
  color: white;
  padding-top: 1%;
  padding-bottom: 1%;
  width: 300px;
  margin: auto;
}

small {
  /* display: inline-block; */
  color: var(--danger);
}
</style>
