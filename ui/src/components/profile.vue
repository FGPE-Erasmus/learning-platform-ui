<template>
  <div class="container emp-profile">
    <div>
      <ul class="nav nav-tabs" id="profile-tabs" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link active"
            id="profile-tab"
            data-toggle="tab"
            href="#profile"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >Profile</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="statistics-tab"
            data-toggle="tab"
            href="#statistics"
            role="tab"
            aria-controls="statistics"
            aria-selected="false"
          >Statistics</a>
        </li>
      </ul>
      <div class="tab-content" id="profile-tab-content">
        <div class="tab-pane  active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <div class="table-responsive">
            <table class="table mt-2" id="profile-table" width="100%" cellspacing="0">
              <tbody>
                <tr>
                  <td>First name</td>
                  <td> {{ this.getUserMe.first_name }}</td>
                </tr>
                <tr>
                  <td>Last name</td>
                  <td>{{ this.getUserMe.last_name }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{ this.getUserMe.email }}</td>
                </tr>
                <tr>
                  <td>Phone number</td>
                  <td>{{ this.getUserMe.phone_num || '-' }}</td>
                </tr>
                <tr>
                  <td>Facebook</td>
                  <td>{{ this.getUserMe.facebook_id || '-' }}</td>
                </tr>
                <tr>
                  <td>Google</td>
                  <td>{{ this.getUserMe.google_id || '-' }}</td>
                </tr>
                <tr>
                  <td>Twitter</td>
                  <td>{{ this.getUserMe.twitter_id || '-' }}</td>
                </tr>
                <tr>
                  <td>Github</td>
                  <td>{{ this.getUserMe.github_id || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mb-2 mt-2 float-right">
            <router-link class="btn btn-outline-primary" :to="{ name: 'profileEdit' }">
              Edit
            </router-link>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="statistics"
          role="tabpanel"
          aria-labelledby="statistics-tab"
        >
          <div class="tab-pane  active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div class="table-responsive">
              <table class="table mt-2" id="profile-table" width="100%" cellspacing="0">
                <tbody>
                  <tr>
                    <td>Interface lang</td>
                    <td>{{ this.getUserMeProfile.interface_lang }}</td>
                  </tr>
                  <tr>
                    <td>Level</td>
                    <td>{{ this.getUserMeProfile.level }}</td>
                  </tr>
                  <tr>
                    <td>points</td>
                    <td>{{ this.getUserMeProfile.points }}</td>
                  </tr>
                  <tr>
                    <td>Badges</td>
                    <td v-if="getUserMeProfile.badges">
                      <ul>
                        <li v-for="badge in getUserMeProfile.badges" :key="badge.id">{{ badge.name }}</li>
                      </ul>
                    </td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $store from "./../store/store";
import $i18n from "./../plugins/i18n.js";
import axios from "axios";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "profile",

  data() {
    return {

    }
  },

  created() {
    this.fetchUserMe();
    this.fetchUserMeProfile();
  },

  computed: {
    ...mapGetters(["getUserMe", "getUserMeProfile"]),
    interface_lang: function() {
      return $store.state.interface_lang;
    },
    email: function() {
      return $store.state.email;
    },
    badge: function() {
      return $store.state.badge;
    },
    level: function() {
      return $store.state.level;
    },
    points: function() {
      return $store.state.points;
    },
    time_spent: function() {
      return $store.state.time_spent;
    },
    ui_color: function() {
      return $store.state.ui_color;
    }
  },

  methods: {
    ...mapActions(["fetchUserMe", "fetchUserMeProfile"])
  }
};
</script>

<style>
.emp-profile {
  padding: 3%;
  margin-top: 3%;
  margin-bottom: 3%;
  border-radius: 0.5rem;
  background: #fff;
}
.profile-img {
  text-align: center;
}
.profile-img img {
  width: 70%;
  height: 100%;
}
.profile-img .file {
  position: relative;
  overflow: hidden;
  margin-top: -20%;
  width: 70%;
  border: none;
  border-radius: 0;
  font-size: 15px;
  background: #212529b8;
}
.profile-img .file input {
  position: absolute;
  opacity: 0;
  right: 0;
  top: 0;
}
.profile-head h5 {
  color: #333;
}
.profile-head h6 {
  color: #0062cc;
}
.profile-edit-btn {
  border: none;
  border-radius: 1.5rem;
  width: 70%;
  padding: 2%;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
}
.proile-rating {
  font-size: 12px;
  color: #818182;
  margin-top: 5%;
}
.proile-rating span {
  color: #495057;
  font-size: 15px;
  font-weight: 600;
}
.profile-head .nav-tabs {
  margin-bottom: 5%;
}
.profile-head .nav-tabs .nav-link {
  font-weight: 600;
  border: none;
}
.profile-head .nav-tabs .nav-link.active {
  border: none;
  border-bottom: 2px solid #0062cc;
}
.profile-work {
  padding: 14%;
  margin-top: -15%;
}
.profile-work p {
  font-size: 12px;
  color: #818182;
  font-weight: 600;
  margin-top: 10%;
}
.profile-work a {
  text-decoration: none;
  color: #495057;
  font-weight: 600;
  font-size: 14px;
}
.profile-work ul {
  list-style: none;
}
.profile-tab label {
  font-weight: 600;
}
.profile-tab p {
  font-weight: 600;
  color: #0062cc;
}
</style>