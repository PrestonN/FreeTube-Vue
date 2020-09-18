import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
import FtCard from '../ft-card/ft-card.vue'
import FtButton from '../../components/ft-button/ft-button.vue'
import FtSelect from '../ft-select/ft-select.vue'
import FtInput from '../ft-input/ft-input.vue'
import FtToggleSwitch from '../ft-toggle-switch/ft-toggle-switch.vue'
import FtFlexBox from '../ft-flex-box/ft-flex-box.vue'

import debounce from 'lodash.debounce'

export default Vue.extend({
  name: 'SyncSettings',
  components: {
    'ft-card': FtCard,
    'ft-button': FtButton,
    'ft-select': FtSelect,
    'ft-input': FtInput,
    'ft-toggle-switch': FtToggleSwitch,
    'ft-flex-box': FtFlexBox
  },
  data: function () {
    return {
      syncStrategyValues: [
        'overwrite_older',
        'overwrite_remote',
        'overwrite_local'
      ]
    }
  },
  computed: {

    syncSubscriptions: function () {
      return this.$store.getters.getSyncSubscriptions
    },

    syncHistory: function () {
      return this.$store.getters.getSyncHistory
    },

    syncSettings: function () {
      return this.$store.getters.getSyncSettings
    },

    syncPreferences: function () {
      return this.$store.getters.getSyncPreferences
    },

    autoSync: function () {
      return this.$store.getters.getAutoSync
    },

    syncStrategy: function () {
      return this.$store.getters.getSyncStrategy
    },

    webdavServerUrl: function () {
      return this.$store.getters.getWebdavServerUrl
    },

    webdavServerDir: function () {
      return this.$store.getters.getWebdavServerDir
    },

    webdavUsername: function () {
      return this.$store.getters.getWebdavUsername
    },

    webdavPassword: function () {
      return this.$store.getters.getWebdavPassword
    },

    webdavDigestAuth: function () {
      return this.$store.getters.getWebdavDigestAuth
    },

    syncStrategyNames: function () {
      return [
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_older'),
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_remote'),
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_local')
      ]
    }

  },
  mounted: function () {

    this.updateWebdavServerUrlBounce = debounce(function(webdavServerUrl) {
      this.setWebdavServerUrl(webdavServerUrl)
      this.updateWebdavServerUrl(webdavServerUrl)
    }, 500)

    this.updateWebdavServerDirBounce = debounce(function(webdavServerDir) {
      this.setRemoteDir(webdavServerDir)
      this.updateWebdavServerDir(webdavServerDir)
    }, 500)

    this.updateWebdavUsernameBounce = debounce(function(webdavUsername) {
      this.setWebdavUsername(webdavUsername)
      this.updateWebdavUsername(webdavUsername)
    }, 500)

    this.updateWebdavPasswordBounce = debounce(function(webdavPassword) {
      this.setWebdavPassword(webdavPassword)
      this.updateWebdavPassword(webdavPassword)
    }, 500)

    console.log("MOUNTED",this)

    this.setWebdavServerUrl(this.webdavServerUrl)
    this.setWebdavServerDir(this.webdavServerDir)
    this.setWebdavUsername(this.webdavUsername)
    this.setWebdavPassword(this.webdavPassword)

    this.setSyncType({syncType: "subscriptions", enable: this.syncSubscriptions})
    this.setSyncType({syncType: "history",  enable: this.syncHistory})
    this.setSyncType({syncType: "settings",  enable: this.syncSettings})
    this.setSyncType({syncType: "preferences",  enable: this.syncPreferences})
    this.setWebdavDigestAuth(this.webdavDigestAuth)
    this.setSyncStrategy(this.syncStrategy)
    this.setRemoteDir(this.webdavServerDir)

  },
  methods: {

    handleWebdavServerUrlInput: function (input) {
      const webdavServerUrl = input
      this.updateWebdavServerUrlBounce(webdavServerUrl)
    },
    handleWebdavServerDirInput: function (input) {
      const webdavServerDir = input
      this.updateWebdavServerDirBounce(webdavServerDir)
    },
    handleWebdavUsernameInput: function (input) {
      const webdavUsername = input
      this.updateWebdavUsernameBounce(webdavUsername)
    },
    handleWebdavPasswordInput: function (input) {
      const webdavPassword = input
      this.updateWebdavPasswordBounce(webdavPassword)
    },
    handleSyncSubscriptionsChange: function (input) {
      this.setSyncType({syncType: "subscriptions", enable: input})
      this.updateSyncSubscriptions(input)
    },
    handleSyncSettingsChange: function (input) {
      this.setSyncType({syncType: "settings", enable: input})
      this.updateSyncSettings(input)
    },
    handleSyncHistoryChange: function (input) {
      this.setSyncType({syncType: "history", enable: input})
      this.updateSyncHistory(input)
    },
    handleSyncPreferencesChange: function (input) {
      this.setSyncType({syncType: "preferences", enable: input})
      this.updateSyncPreferences(input)
    },
    handleWebdavDigestAuthChange: function (input) {
      this.setWebdavDigestAuth(input)
      this.updateWebdavDigestAuth(input)
    },
    handleAutoSyncChange: function (input) {
      this.setAutoSync(input)
      this.updateAutoSync(input)
    },
    handleSyncStrategyChange: function (input) {
      this.setSyncStrategy(input)
      this.updateSyncStrategy(input)
    },

    triggerSync: async function() {
      try {
        await this.sync()
      } catch (e) {
        console.error(e)
      }
    },


    ...mapActions([
      'updateSyncSubscriptions',
      'updateSyncHistory',
      'updateSyncSettings',
      'updateSyncPreferences',
      'updateAutoSync',
      'updateSyncStrategy',
      'updateWebdavServerUrl',
      'updateWebdavServerDir',
      'updateWebdavUsername',
      'updateWebdavPassword',
      'updateWebdavDigestAuth',
      'sync'
    ]),

    ...mapMutations([
      'setWebdavDigestAuth',
      'setWebdavServerUrl',
      'setWebdavServerDir',
      'setWebdavUsername',
      'setWebdavPassword',
      'setWebdavDigestAuth',
      'setRemoteDir',
      'setSyncType',
      'setSyncStrategy'
    ])
  }
})
